---
layout: "../../layouts/BlogPost.astro"
title: "How I Structure My Terraform Code"
description: "Infrastructure as code is awesome! Here's how I utilize it"
pubDate: "2022-09-27"
heroImage: "../../assets/blog/how-i-structure-my-terraform-code/hero-image.jpg"
tags: ["technologies", "infrastructure"]
---

As a quick TLDR, Terraform allows me to write code to create infrastructure. So instead of

1. Open cloud provider UI
2. Click 10-15 buttons
3. Click Create
4. make sure to remember how to do this later by writing a doc somewhere

We can just run `terraform plan` to see what changes will be made and `terraform apply` to make the changes.

The HashiCorp [docs](https://www.terraform.io/docs#terraform-documentation) do a great job of explaining this deeper.

## How do I use terraform?

Great question! Simply 3 total layers of abstractions:

- **The first layer**: creating a module with all the necessary resources but with tons of inputs to allow you to adjust the resource configurations for your specific needs.
- **Second layer**: creating a module wrapper for the first layer based on different environments (staging vs production) where most inputs are hardcoded outside a few that need to be different across environments, such as tags.
- **Third layer**: calling the second layer with environment-specific inputs

Alright alright, enough words, let's see some code.

To set the stage, we are tasked with creating an API service with 3 servers, a database, and a load balancer. We roughly need something like the below to complete this.

```hcl
resource "load_balancer" "my_load_balancer" {
  name = "my-service-load-balancer"
  env  = "staging"
}

resource "server" "my_server" {
  count         = 3
  size          = "md"
  load_balancer = load_balancer.my_load_balancer.name
  env           = "staging"
}

resource "database" "my_database" {
  name     = "my-database"
  username = "app-user"
  password = "topsecretnoonewillknow"
  engine   = "mysql"
  size     = "large"
  env      = "staging"
}
```

This code works wonderfully, then another team notices your code and asks to have the exact setup, but they want an `lg` server instead.

> What do we do? Do we just copy it and change the server size?

So, we can create a terraform module to abstract the code so others can use it easily. Now that we have 2 total users for our terraform, we need to make it more generic: meaning we take most of the inputs and allow them as arguments for our module.

As an example, the `load_balancer` code from above will become:

```hcl {2-3}
resource "load_balancer" "my_load_balancer" {
  name = var.load_balancer_name
  env  = var.env
}
```

And we just create a `variables.tf` in the same module directory

```hcl
variables "env" {
  type        = "string"
  description = "Environment of the application"
}

variables "load_balancer_name" {
  type        = "string"
  description = "The name of the load balancer"
}

...
```

After this first layer of abstraction, we just need to write:

```hcl
module "api_service" {
  source = "github.com/my-company/terraform-modules/api_service"

  env         = "staging"
  name        = "my-load-balancer"
  server_size = "md"
  db_name     = "my-database"
  db_size     = "large"
  db_user     = "my-db-user"
  db_password = "thisisnotverysecret"
}
```

See, way less code! Less is always more (except for your parent's approval)

Moving onto the 2nd layer, because the terraform module is written to be more generic, and our application has specific needs, we would create another module within our app repo.

This new module will use the first layer module as its source, then we hardcode most of the inputs and leave off a couple to differentiate between environments.

```hcl {5,11}
# terraform/modules/my-service/main.tf
module "api_service" {
  source = "github.com/my-company/terraform-modules/api_service"

  env         = var.env
  name        = "my-load-balancer"
  server_size = "md"
  db_name     = "my-database"
  db_size     = "large"
  db_user     = "my-db-user"
  db_password = var.db_password
}
```

The only variables we need to pass in are `env` and `db_password` when creating infrastructure for each env. This ensures different environments are as closely matched as possible.

```hcl
# terraform/env/staging/main.tf
module "api_service" {
  source = "../modules/my-service"

  env         = "staging"
  db_password = "whatisitgoodfor"
}

# terraform/env/prod/main.tf
module "api_service" {
  source = "../modules/my-service"

  env         = "prod"
  db_password = "absolutelynothing"
}
```

To summarize how the modules are setup,

```tree
# module repo
├── main.tf
├── variables.tf

# app repo
|-- terraform
|-- env
│   ├── staging
│   │   ├── main.tf
│   ├── prod
│   │   ├── main.tf
├── modules/
│   ├── my-service/
│   │   ├── variables.tf
│   │   ├── main.tf
```

### Quick Tip: how to terraform if you don't know what inputs you need to change

Start with making a change in the cloud provider UI.

Then run a plan in terraform, which will detect the difference.

Now just change the input that that code shows and run a new plan to see that terraform now says no changes.
