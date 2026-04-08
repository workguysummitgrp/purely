resource "aws_ecr_repository" "purely_wishlist_registry" {
  name                 = "purely_wishlist_registry"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}
