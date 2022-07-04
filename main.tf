
locals {
  domain_name = "mech.goonsackgames.com"
}

resource "aws_route53_zone" "zone" {
  name = local.domain_name
}

module "website" {
  source = "./modules/website"
  providers = {
    aws             = aws
    aws.certificate = aws.certificate
  }

  domain_name    = local.domain_name
  hosted_zone_id = aws_route53_zone.zone.zone_id
}
