#!/bin/bash

read -p 'Name of blog: ' blog

blog=$(echo $blog | tr ' ' -)

echo "setting blog with name $blog"

mkdir public/blog/$blog
touch src/pages/blog/$blog.mdx


cat > src/pages/blog/$blog.mdx << EOF
layout: "../../layouts/BlogPost.astro"
title: "<TODO>"
description: "<TODO>"
pubDate: "<TODO>"
heroImage: "/blog/$blog/hero-image.webp"
tags: []
---

# start blog here
EOF