output "hostnames" {
  value = [local.website_hostname, local.website_hostname_www]
}
