# https://section411.com/2019/07/hello-world/
# https://medium.com/@bradford_hamilton/deploying-containers-on-amazons-ecs-using-fargate-and-terraform-part-2-2e6f6a3a957f

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

resource "aws_acm_certificate" "this" {
  domain_name               = "goonsackgames.com"
  subject_alternative_names = ["*.goonsackgames.com"]
  validation_method         = "DNS"
}

resource "aws_route53_zone" "this" {
  name = "goonsackgames.com"
}
# Note: Manually update name servers to match those assigned to this resource

resource "aws_route53_record" "certificate_validation_cname_records" {
  for_each = {
    for dvo in aws_acm_certificate.this.domain_validation_options : dvo.domain_name => {
      name    = dvo.resource_record_name
      record  = dvo.resource_record_value
      type    = dvo.resource_record_type
      zone_id = aws_route53_zone.this.id
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = each.value.zone_id
}

resource "aws_acm_certificate_validation" "this" {
  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [for record in aws_route53_record.certificate_validation_cname_records : record.fqdn]
}

resource "aws_cloudfront_distribution" "cdn" {
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

  ordered_cache_behavior {
    path_pattern           = "/index.html"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    viewer_protocol_policy = "redirect-to-https"
    target_origin_id       = aws_s3_bucket.website.website_domain
    cache_policy_id        = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.this.certificate_arn
    minimum_protocol_version = "TLSv1"
    ssl_support_method       = "sni-only"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

resource "aws_route53_record" "root_a_record" {
  name    = "goonsackgames.com"
  zone_id = aws_route53_zone.this.id
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www_cname_record" {
  name    = "www.goonsackgames.com"
  zone_id = aws_route53_zone.this.id
  type    = "CNAME"
  ttl     = "300"
  records = ["goonsackgames.com"]
}

resource "aws_route53_record" "api_a_record" {
  name    = "api.goonsackgames.com"
  zone_id = aws_route53_zone.this.id
  type    = "A"

  alias {
    name                   = aws_alb.this.dns_name
    zone_id                = aws_alb.this.zone_id
    evaluate_target_health = false
  }
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

resource "aws_vpc" "this" {
  cidr_block = "10.0.0.0/16"
}

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_subnet" "public_1" {
  vpc_id            = aws_vpc.this.id
  availability_zone = data.aws_availability_zones.available.names[0]
  cidr_block        = "10.0.5.0/24"
}

resource "aws_subnet" "public_2" {
  vpc_id            = aws_vpc.this.id
  availability_zone = data.aws_availability_zones.available.names[1]
  cidr_block        = "10.0.3.0/24"
}

resource "aws_subnet" "private_1" {
  vpc_id            = aws_vpc.this.id
  availability_zone = data.aws_availability_zones.available.names[0]
  cidr_block        = "10.0.6.0/24"
}

resource "aws_subnet" "private_2" {
  vpc_id            = aws_vpc.this.id
  availability_zone = data.aws_availability_zones.available.names[1]
  cidr_block        = "10.0.4.0/24"
}

resource "aws_route_table" "public_1" {
  vpc_id = aws_vpc.this.id
}

resource "aws_route_table" "public_2" {
  vpc_id = aws_vpc.this.id
}

resource "aws_route_table" "private_1" {
  vpc_id = aws_vpc.this.id
}

resource "aws_route_table" "private_2" {
  vpc_id = aws_vpc.this.id
}

resource "aws_route_table_association" "public_1" {
  subnet_id      = aws_subnet.public_1.id
  route_table_id = aws_route_table.public_1.id
}

resource "aws_route_table_association" "public_2" {
  subnet_id      = aws_subnet.public_2.id
  route_table_id = aws_route_table.public_2.id
}

resource "aws_route_table_association" "private_1" {
  subnet_id      = aws_subnet.private_1.id
  route_table_id = aws_route_table.private_1.id
}

resource "aws_route_table_association" "private_2" {
  subnet_id      = aws_subnet.private_2.id
  route_table_id = aws_route_table.private_2.id
}

resource "aws_eip" "private_1" {
  vpc = true
}

resource "aws_eip" "private_2" {
  vpc = true
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
}

resource "aws_nat_gateway" "private_1" {
  subnet_id     = aws_subnet.public_1.id
  allocation_id = aws_eip.private_1.id
}

resource "aws_nat_gateway" "private_2" {
  subnet_id     = aws_subnet.public_2.id
  allocation_id = aws_eip.private_2.id
}

resource "aws_route" "public_1" {
  route_table_id         = aws_route_table.public_1.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.this.id
}

resource "aws_route" "public_2" {
  route_table_id         = aws_route_table.public_2.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.this.id
}

resource "aws_route" "private_1" {
  route_table_id         = aws_route_table.private_1.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.private_1.id
}

resource "aws_route" "private_2" {
  route_table_id         = aws_route_table.private_2.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.private_2.id
}

resource "aws_security_group" "services" {
  vpc_id = aws_vpc.this.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "TCP"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "TCP"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_cluster" "services" {
  name = "services"
}

resource "aws_ecs_service" "api" {
  name            = "api"
  cluster         = aws_ecs_cluster.services.id
  task_definition = aws_ecs_task_definition.api.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    assign_public_ip = false

    security_groups = [
      aws_security_group.services.id,
    ]

    subnets = [
      aws_subnet.private_1.id,
      aws_subnet.private_2.id
    ]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "api"
    container_port   = "80"
  }
}

resource "aws_cloudwatch_log_group" "api" {
  name = "/ecs/api"
}

resource "aws_ecs_task_definition" "api" {
  family             = "api"
  execution_role_arn = aws_iam_role.services.arn

  container_definitions = jsonencode(
    [
      {
        name  = "api"
        image = "aaronshiels/goonsackgames:latest"
        portMappings = [
          {
            containerPort = 80
          }
        ]
        logConfiguration = {
          logDriver = "awslogs",
          options = {
            awslogs-region        = "us-east-1"
            awslogs-group         = "/ecs/api"
            awslogs-stream-prefix = "ecs"
          }
        }
      }
  ])

  cpu                      = 1024
  memory                   = 2048
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
}

resource "aws_iam_role" "services" {
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "1",
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "ecs-tasks.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "services" {
  role       = aws_iam_role.services.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_alb" "this" {
  internal           = false
  load_balancer_type = "application"
  subnets            = [aws_subnet.public_1.id, aws_subnet.public_2.id]
  security_groups    = [aws_security_group.services.id]
}

resource "aws_lb_target_group" "api" {
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.this.id

  health_check {
    enabled = true
    path    = "/health"
  }
}

resource "aws_alb_listener" "api" {
  load_balancer_arn = aws_alb.this.arn
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = aws_acm_certificate.this.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }
}
