provider "aws" {
  profile = "personal"
  region  = "us-west-2"

  default_tags {
    tags = {
      project = "mech.goonsackgames.com"
    }
  }
}

# https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html#https-requirements-certificate-issuer
provider "aws" {
  profile = "personal"
  region  = "us-east-1"
  alias   = "certificate"

  default_tags {
    tags = {
      project = "mech.goonsackgames.com"
    }
  }
}
