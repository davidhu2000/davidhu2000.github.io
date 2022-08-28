---
layout: "../layouts/BlogPost.astro"
title: ""
description: ""
---

![me IRL](/main/programming.svg)

# Welcome to my personal site.

```tsx
enum REASON {
  READ_MY_BLOG,
  LEARN_ABOUT_ME,
  OTHER,
}

interface WelcomeProps {
  name: string,
  reason: REASON,
}

function Welcome({ name, reason }) {
  console.log(`Hi, ${name}, welcome!`);
  console.log(`Glad to have you!`);

  swich(reason) {
    case REASON.READ_MY_BLOG:
      return <Blog />
    case REASON.LEARN_ABOUT_ME:
      return <About />
    case REASON.OTHER:
      return <ToBeBuilt />
    default:
      return <Home />
  }
}
```
