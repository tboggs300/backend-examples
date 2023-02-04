output "apigateway_url" {
  description = "URL for call API Gateway Stage"

  value = aws_apigatewayv2_api.my_gateway.api_endpoint
}
