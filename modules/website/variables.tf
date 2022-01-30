variable "domain_name" {
  description = "The top-level domain name, e.g. foo.com."
}

variable "hosted_zone_id" {
  description = "The ID of the hosted zone associated with the domain."
}

variable "content_dir" {
  description = "The root directory housing the website's content."
}
