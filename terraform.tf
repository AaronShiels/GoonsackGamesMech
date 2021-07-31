terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.52.0"
    }
  }

  backend "s3" {
    profile = "personal"
    region  = "us-west-2"

    bucket = "aaronshiels-state"
    key    = "goonsackgames.com/terraform.tfstate"
  }
}
