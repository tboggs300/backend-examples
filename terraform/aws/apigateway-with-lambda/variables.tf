variable "aws_profile" {}
variable "bucket_id" {}
variable "api_gateway_id" {}
variable "api_gateway_arn" {}
variable "default_lambda_role_arn" {}
variable "target_api_resource_id" {}

variable "function_name" {
  description = "Name of the function, must be unique"
  type        = string
}

variable "function_description" {
  description = "Input variables to be used throughout module"
  type        = string
  default     = ""
}

variable "api_key_required" {
  description = "To determine if an api key is required for the api gateway"
  type        = bool
  default     = true
}

variable "method_type" {
  description = "The HTTP request type"
  type        = string
}

variable "path_to_lambda_folder" {
  description = "Full path from the base of the repo"
  type        = string
}

variable "lambda_folder_name" {
  description = "Name of the folder the lambda is in"
  type        = string
}

variable "lambda_runtime" {
  description = "Option of NodeJS, Python, etc"
  type        = string
  default     = "nodejs14.x"
}

variable "timeout" {
  description = "Amount of time before lambda ends."
  type        = number
  default     = 60
}

