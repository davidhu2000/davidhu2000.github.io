#!/bin/bash

read -p 'Name of blog: ' blog

blog=$(echo $blog | tr ' ' -)

echo "setting blog with name $blog"

git checkout main
git pull 
git checkout -b blog-$blog

mkdir src/assets/blog/$blog
touch src/assets/blog/$blog/.keep
touch src/pages/blog/$blog.md

cat > src/pages/blog/$blog.md << EOF
---
layout: "../../layouts/BlogPost.astro"
title: ""
description: ""
pubDate: ""
heroImage: "./src/assets/blog/$blog/hero-image.jpg"
tags: []
---

# start blog here
EOF
