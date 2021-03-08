terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
}

provider "aws" {
  profile = "default"
  region  = "us-east-1"
}

resource "aws_acm_certificate" "certificate" {
  domain_name               = "goonsackgames.com"
  subject_alternative_names = ["www.goonsackgames.com"]
  validation_method         = "DNS"
}

resource "aws_route53_zone" "zone" {
  name = "goonsackgames.com"
}

resource "aws_route53_record" "certificate_validation_cname_records" {
  for_each = {
    for dvo in aws_acm_certificate.certificate.domain_validation_options : dvo.domain_name => {
      name    = dvo.resource_record_name
      record  = dvo.resource_record_value
      type    = dvo.resource_record_type
      zone_id = aws_route53_zone.zone.id
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = each.value.zone_id
}

resource "aws_acm_certificate_validation" "certificate_validation" {
  certificate_arn         = aws_acm_certificate.certificate.arn
  validation_record_fqdns = [for record in aws_route53_record.certificate_validation_cname_records : record.fqdn]
}

resource "aws_cloudfront_distribution" "distribution" {
  enabled             = true
  aliases             = ["goonsackgames.com", "www.goonsackgames.com"]
  default_root_object = "index.html"

  origin {
    origin_id   = aws_s3_bucket.website.website_domain
    domain_name = aws_s3_bucket.website.bucket_regional_domain_name
  }

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    viewer_protocol_policy = "redirect-to-https"
    target_origin_id       = aws_s3_bucket.website.website_domain
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.certificate_validation.certificate_arn
    minimum_protocol_version = "TLSv1"
    ssl_support_method       = "sni-only"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

resource "aws_route53_record" "a_record" {
  name    = "goonsackgames.com"
  zone_id = aws_route53_zone.zone.id
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.distribution.domain_name
    zone_id                = aws_cloudfront_distribution.distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www_cname_record" {
  name    = "www.goonsackgames.com"
  zone_id = aws_route53_zone.zone.id
  type    = "CNAME"
  ttl     = "300"
  records = ["goonsackgames.com"]
}

resource "aws_s3_bucket" "website" {
  bucket = "goonsackgames.com"
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}

resource "aws_s3_bucket_policy" "website_policy" {
  bucket = aws_s3_bucket.website.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "PublicReadGetObject",
        "Effect" : "Allow",
        "Principal" : "*",
        "Action" : [
          "s3:GetObject"
        ],
        "Resource" : ["${aws_s3_bucket.website.arn}/*"]
      }
    ]
  })
}