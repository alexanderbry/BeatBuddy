# IP-HCK75
# Updated REST API Documentation

This document outlines the endpoints available in the API, including request formats, successful responses with data types, and specific error responses.

## Table of Contents
1. [User Endpoints](#user-endpoints)
2. [Post Endpoints](#post-endpoints)
3. [Profile Endpoints](#profile-endpoints)

## User Endpoints

### Register User
- **URL**: `/users/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "string",
    "username": "string",
    "password": "string"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "id": "number",
      "email": "string",
      "username": "string"
    }
    ```
- **Error Response**:
  - **Code**: 400
  - **Content**: `["Email is required", "Username is required", "Password is required"]`

### Login User
- **URL**: `/users/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "access_token": "string"
    }
    ```
- **Error Response**:
  - **Code**: 401
  - **Content**: `"Invalid email/password"`

### Login with Spotify
- **URL**: `/users/login/spotify`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 302
  - **Headers**: `Location: https://accounts.spotify.com/authorize?...`

### Login with Google
- **URL**: `/users/login/google`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "googleToken": "string"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "access_token": "string"
    }
    ```
- **Error Response**:
  - **Code**: 400
  - **Content**: `"Invalid Google token"`

### Spotify Callback
- **URL**: `/users/callback`
- **Method**: `GET`
- **Query Parameters**: `code=string`
- **Success Response**:
  - **Code**: 302
  - **Headers**: `Location: [CLIENT_BASE_URL]/?spotify_token=string&access_token=string`

## Post Endpoints

### Get All Posts
- **URL**: `/`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    [
      {
        "id": "number",
        "caption": "string",
        "imageUrl": "string",
        "TrackId": "number",
        "ProfileId": "number",
        "createdAt": "string (ISO date)",
        "updatedAt": "string (ISO date)",
        "Profile": {
          "id": "number",
          "fullName": "string",
          "profilePicture": "string"
        }
      }
    ]
    ```

### Create Post
- **URL**: `/posts/create`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "caption": "string",
    "imageUrl": "string",
    "TrackId": "number",
    "ProfileId": "number"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "message": "string"
    }
    ```
- **Error Response**:
  - **Code**: 401
  - **Content**: `"Unauthorized"`

### Update Post
- **URL**: `/posts/:PostId`
- **Method**: `PATCH`
- **Headers**: `Authorization: Bearer <access_token>`
- **URL Parameters**: `PostId=[integer]`
- **Request Body**:
  ```json
  {
    "caption": "string"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "message": "string"
    }
    ```
- **Error Response**:
  - **Code**: 403
  - **Content**: `"Forbidden"`
  - **Code**: 404
  - **Content**: `"Not Found"`

### Delete Post
- **URL**: `/posts/:PostId`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <access_token>`
- **URL Parameters**: `PostId=[integer]`
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "message": "string"
    }
    ```
- **Error Response**:
  - **Code**: 404
  - **Content**: `"Not Found"`

## Profile Endpoints

### Get All Profiles
- **URL**: `/profiles`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    [
      {
        "id": "number",
        "fullName": "string",
        "dateOfBirth": "string (ISO date)",
        "gender": "string",
        "profilePicture": "string",
        "UserId": "number"
      }
    ]
    ```

### Create Profile
- **URL**: `/profiles/create`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "fullName": "string",
    "dateOfBirth": "string (ISO date)",
    "gender": "string",
    "profilePicture": "string"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "message": "string"
    }
    ```
- **Error Response**:
  - **Code**: 400
  - **Content**: `["Full name is required"]`

### Get Profile by ID
- **URL**: `/profiles/profile`
- **Method**: `GET`
- **Query Parameters**: `ProfileId=string`
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "id": "number",
      "fullName": "string",
      "dateOfBirth": "string (ISO date)",
      "gender": "string",
      "profilePicture": "string",
      "UserId": "number",
      "spotifyId": "string"
    }
    ```
- **Error Response**:
  - **Code**: 404
  - **Content**: `"Not Found"`

### Update Profile
- **URL**: `/profiles/:ProfileId`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <access_token>`
- **URL Parameters**: `ProfileId=[integer]`
- **Request Body**:
  ```json
  {
    "fullName": "string",
    "dateOfBirth": "string (ISO date)",
    "gender": "string",
    "profilePicture": "string"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "message": "string"
    }
    ```
- **Error Response**:
  - **Code**: 403
  - **Content**: `"Forbidden"`
  - **Code**: 404
  - **Content**: `"Not Found"`

## Error Handling

The API uses the following error codes:

- **400 Bad Request**: The request was invalid or cannot be served.
- **401 Unauthorized**: The request requires user authentication.
- **403 Forbidden**: The server understood the request but refuses to authorize it.
- **404 Not Found**: The requested resource could not be found.
- **500 Internal Server Error**: The server encountered an unexpected condition which prevented it from fulfilling the request.

For all error responses, the structure will be:

```json
"Error description"
```

Where "Error description" is a string describing the error.

## Authentication

Most endpoints require authentication. To authenticate, include the `Authorization` header with a Bearer token:

```
Authorization: Bearer <access_token>
```

The access token is obtained from the login endpoints (normal login, Spotify login, or Google login).

## Middlewares

The API uses several middleware functions for authentication and authorization:

1. `authentication`: Verifies the JWT token and attaches the user information to the request.
2. `postAuthor`: Ensures that the user is the author of the post they're trying to modify or delete.
3. `profileAuthor`: Ensures that the user is the owner of the profile they're trying to modify.

These middlewares are applied to relevant routes to enforce security and proper access control.