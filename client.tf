resource "aws_acm_certificate" "website" {
  domain_name               = "goonsackgames.com"
  subject_alternative_names = ["*.goonsackgames.com"]
  validation_method         = "DNS"

  provider = aws.certificate
}

# Note: Manually update name servers to match those assigned to this resource
resource "aws_route53_zone" "website" {
  name = "goonsackgames.com"
}

resource "aws_route53_record" "certificate_validation_cname_records" {
  for_each = {
    for dvo in aws_acm_certificate.website.domain_validation_options : dvo.domain_name => {
      name    = dvo.resource_record_name
      record  = dvo.resource_record_value
      type    = dvo.resource_record_type
      zone_id = aws_route53_zone.website.id
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = each.value.zone_id
}

resource "aws_acm_certificate_validation" "website" {
  certificate_arn         = aws_acm_certificate.website.arn
  validation_record_fqdns = [for record in aws_route53_record.certificate_validation_cname_records : record.fqdn]

  provider = aws.certificate
}

resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  aliases             = ["goonsackgames.com", "www.goonsackgames.com"]
  default_root_object = "index.html"

  origin {
    origin_id   = aws_s3_bucket.website.bucket_domain_name
    domain_name = aws_s3_bucket.website.bucket_regional_domain_name

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.website.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    viewer_protocol_policy = "redirect-to-https"
    target_origin_id       = aws_s3_bucket.website.bucket_domain_name
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" # Managed-CachingOptimized
  }

  ordered_cache_behavior {
    path_pattern           = "/index.html"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    viewer_protocol_policy = "redirect-to-https"
    target_origin_id       = aws_s3_bucket.website.bucket_domain_name
    cache_policy_id        = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # Managed-CachingDisabled
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate_validation.website.certificate_arn
    ssl_support_method  = "sni-only"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

resource "aws_route53_record" "website_a" {
  name    = "goonsackgames.com"
  zone_id = aws_route53_zone.website.id
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "website_cname_www" {
  name    = "www.goonsackgames.com"
  zone_id = aws_route53_zone.website.id
  type    = "CNAME"
  ttl     = "300"
  records = ["goonsackgames.com"]
}

resource "aws_cloudfront_origin_access_identity" "website" {
}

resource "aws_s3_bucket" "website" {
  bucket = "goonsackgames.com"

  website {
    index_document = "index.html"
  }
}

data "aws_iam_policy_document" "website" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.website.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.website.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id
  policy = data.aws_iam_policy_document.website.json
}

module "template_files" {
  source  = "hashicorp/dir/template"
  version = "1.0.2"

  base_dir = "${path.module}/dist/client"
}

resource "aws_s3_bucket_object" "website" {
  for_each = module.template_files.files

  bucket       = aws_s3_bucket.website.bucket
  key          = each.key
  content_type = each.value.content_type
  source       = each.value.source_path
  content      = each.value.content
}
