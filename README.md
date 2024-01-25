# Manga API

The Manga API is a powerful tool for accessing manga-related information. Whether you're building a manga-centric application or exploring the world of manga data, this API provides a variety of features to suit your needs.

## Features

1. **Search Manga:**
   - **Endpoint:** `/search`
   - **Method:** `GET`
   - **Description:** Returns a list of manga based on the provided search query. Includes details such as manga ID, image, title, author, update, and view count. Supports pagination.
   - **Parameters:**
     - `query`: The search query string.
     - `page`: The page number (optional).

2. **Get Chapter Information:**
   - **Endpoint:** `/chapter-info`
   - **Method:** `GET`
   - **Description:** Retrieves detailed information about a specific manga chapter. Includes metadata about the manga, such as title, alternative titles, authors, status, genres, ratings, summary, and chapter details.
   - **Parameters:**
     - `query`: The manga ID.

3. **Fetch Chapter Images:**
   - **Endpoint:** `/fetch-chapter`
   - **Method:** `GET`
   - **Description:** Fetches images and details for a specific manga chapter based on the chapter ID.
   - **Parameters:**
     - `query`: The chapter ID.

4. **Get Latest Manga Releases:**
   - **Endpoint:** `/latest-release`
   - **Method:** `GET`
   - **Description:** Returns the latest manga releases with details such as manga ID, thumbnail, title, and chapters.

5. **Get Latest Manga:**
   - **Endpoint:** `/latest-manga`
   - **Method:** `GET`
   - **Description:** Returns a list of the latest manga with details including manga ID, image, title, latest chapter, and more. Supports pagination.
   - **Parameters:**
     - `page`: The page number (optional).

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/FireFlyDeveloper/Manga-API.git
