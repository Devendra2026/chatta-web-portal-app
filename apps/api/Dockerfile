###############################################################################################################################

# 1. Use the official lightweight Python image
FROM python:3.14-slim

# 2. Install uv directly into the container
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# 3. Set the working directory inside the container
WORKDIR /app

# 4. Copy your dependency management files first (for caching speed)
COPY pyproject.toml uv.lock ./

# 5. Sync and install all your dependencies without building a project package
RUN uv sync --frozen --no-install-project

# 6. Copy your application source code into the container
COPY . .

# 7. Expose the port your FastAPI app runs on
EXPOSE 8000

# 8. Start the FastAPI server using uv to call your entrypoint
CMD ["uv", "run", "fastapi", "run", "app/main.py", "--host", "0.0.0.0", "--port", "8000"]

