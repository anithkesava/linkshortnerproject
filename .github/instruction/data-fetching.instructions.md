---
description: Read this file to understand how to fetch data in the project.
---
# Data Fetching Guidelines
This document outlines the best practices for fetching data in our project. Follow these guidelines to ensure consistency and maintainability across the codebase.
## 1. Use Server components for Data Fetching
In Next.js, ALWAYS using Server components for data fetching. Never use client components for data fetching. 

## 2. Data Fetching Methods
ALWAYS use the helper functions provided in the /data directory for data fetching. NEVER fetch data directly in the components.

ALL helper functions in the /data directory should use Drizzle ORM for database interactions. 