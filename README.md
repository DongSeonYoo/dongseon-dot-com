# CRUD API Practice

__DIRNAME__ = http://13.125.33.251:8000

데이터 형식: JSON

# 1. 계정 API

- ## 1.1: 로그인 API
  - URL: `"/login"`
  - Method: `POST`

    ### Request Type: `Body`
    ```json
    {
      "login_id": "test123",
      "pw": "1234"
    }
    ```

    ### Response (성공)
    #### 성공 시 userPK반환
    ```json
    {
      "success": true,
      "message": "로그인 성공, user: (userPk)"
    }
    ```

    ### Response (실패)
    ```json
    {
      "success": false,
      "message": "아이디 혹은 비밀번호가 올바르지 않습니다"
    }
    ```

  ## 1.2 회원가입 API
  - URL: `"/account"`
  - Method: `POST`

    ### Request Type: `Body`
    ```json
    {
      "login_id": "test123",
      "pw": "1234",
      "name": "dongSeon",
      "phoneNumber": "01012345678",
      "email": "test@naver.com"
    }
    ```

    ### Response (성공)
    ```json
    {
      "success": true,
      "message": "회원가입 성공"
    }
    ```

    ### Response (실패)
    ```json
    {
      "success": false,
      "message": "sql Error Message"
    }
    ```

  ## 1.3 아이디 찾기 API
    - URL: `"/account/id"`
    - Method: `GET`

      ### Request Type: `Query`
      ```json
      {
        "name": "dongSeon",
        "phoneNumber": "01012345678",
        "email": "test@naver.com"
      }
      ```

      ### Response (성공)
      ```json
      {
        "success": true,
        "message": "test123"
      }
      ```

      ### Response (실패)
      ```json
      {
        "success": false,
        "message": "해당하는 아이디 없습니다"
      }
      ```

  ## 1.4 비밀번호 찾기 API (1. 사용자 검증 단계)
    - URL: `"/account/pw"`
    - Method: `GET`

      ### Request Type: `Query`
      ```json
      {
        "login_id": "test123",
        "name": "dongSeon",
        "phoneNumber": "01012345678",
        "email": "test@naver.com"
      }
      ```

      ### Response (성공)
      ```json
      {
        "success": true,
        "message": {
            "id": 54
        }
      }
      ```

      ### Response (실패)
      ```json
      {
        "success": false,
        "message": "해당하는 유저가 없습니다"
      }
      ```

  ## 1.5 비밀번호 찾기 API (2. 비밀번호 재설정 단계)
    - URL: `"/account/pw"`
    - Method: `POST`

      ### Request Type: `Body`
      ```json
      {
        "userPk": 54,
        "newPw": 4321
      }
      ```

      ### Response (성공)
      ```json
      {
        "success": true,
        "message": "재설정 성공"
      }
      ```

      ### Response (실패)
      ```json
      {
        "success": false,
        "message": "재설정 실패, 해당하는 사용자를 찾지 못했습니다"
      }
      ```

  ## 1.6 내 프로필 보기 API
    - URL: `"/account"`
    - Method: `GET`

      ### Request Type: `Query`
      ```json
      {
        "userPk": 54
      }
      ```

      ### Response (성공)
      ```json
      {
        "success": true,
        "message": {
            "login_id": "test123",
            "name": "dongSeon",
            "phone_number": "01012345678",
            "email": "test@naver.com",
            "created_date": "2023-06-23T11:54:30.000Z",
            "updated_date": "2023-06-23T11:54:30.000Z"
        }
      }
      ```

      ### Response (실패)
      ```json
      {
        "success": false,
        "message": "조회에 실패하였습니다"
      }
      ```

  ## 1.7 회원 정보 수정 API
    - URL: `"/account"`
    - Method: `PUT`

      ### Request Type: `Body`
      ```json
      {
        "userPk": 54,
        "name": "dongSeon",
        "phoneNumber": "01012345678",
        "email": "test@naver.com"
      }
      ```

      ### Response (성공)
      ```json
      {
        "success": true,
        "message": "수정에 성공하였습니다"
      }
      ```

      ### Response (실패)
      ```json
      {
        "success": false,
        "message": "수정에 실패하였습니다"
      }
      ```

  ## 1.8 회원 탈퇴 API
    - URL: `"/account"`
    - Method: `DELETE`

      ### Request Type: `Body`
      ```json
      {
        "userPk": 54,
      }
      ```

      ### Response (성공)
      ```json
      {
        "success": true,
        "message": "탈퇴되었습니다"
      }
      ```

      ### Response (실패)
      ```json
      {
        "success": false,
        "message": "탈퇴에 실패하였습니다"
      }
      ```



# 2. 게시글 API

  - ## 2.1: 게시글 작성 API
    - URL: `"/post"`
    - Method: `POST`

      ### Request Type: `Body`

        ### Request
        ```json
        {
          "userPk": 54,
          "title": "dongSeon의 게시글 제목입니당",
          "content": "dongSeon의 게시글 본문입니당"
        }
        ```

        ### Response (성공)
        ```json
        {
          "success": true,
          "message": "작성에 성공하였습니다"
        }
        ```

        ### Response (실패)
        ```json
        {
          "success": false,
          "message": "sql Error Message"
        }
        ```

  - ## 2.2: 모든 게시글 조회 API
    - URL: `"/posts"`
    - Method: `GET`

      ### Request Type: `none`

        ### Response (성공)
        ```json
        {
          "success": true,
          "message": 
          {
            "id": 17,
            "user_id": 54,
            "title": "dongSeon의 게시글 제목입니당",
            "content": "dongSeon의 게시글 본문입니당",
            "created_date": "2023-06-23T08:19:14.000Z",
            "updated_date": "2023-06-23T08:19:14.000Z"
          },
          {
            "id": 12,
            "user_id": 1,
            "title": "하하",
            "content": "음음음음음음음음음음음음음음음음음음음",
            "created_date": "2023-06-22T08:43:33.000Z",
            "updated_date": "2023-06-23T06:20:31.000Z"
          },

          ...
        }
        ```

        ### Response (실패)
        ```json
        {
          "success": false,
          "message": "sql Error Message"
        }
        ```

  - ## 2.3: 특정 게시글 조회 API
    - URL: `"/post/:postId"`
    - Method: `GET`

      ### Request Type: `params`
      ```
      "/post/17"
      ```

      ### Response (성공)
      ```json
      {
        "success": true,
        "message": [
          {
              "id": 1,
              "user_id": 1,
              "title": "제목수정이요",
              "content": "본문수정이요",
              "created_date": "2023-06-22T07:22:34.000Z",
              "updated_date": "2023-06-23T06:43:11.000Z"
          }
        ]
      }
      ```

      ### Response (실패)
      ```json
      {
        "success": false,
        "message": "해당하는 게시글이 존재하지 않습니다"
      }
      ```

  - ## 2.3: 특정 사용자의 게시글 조회 API
    - URL: `"/account/:userLoginId/posts"`
    - Method: `GET`

      ### Request Type: `params`

      : 사용자의 로그인 아이디
      ```
      "/account/test123/posts"
      ```

      ### Response (성공)
      ```json
      {
        "success": true,
        "message": [
          {
            "id": 19,
            "user_id": 61,
            "title": "test유저의 게시글 제목입니다",
            "content": "test유저의 게시글 본무닙니다",
            "created_date": "2023-06-23T12:05:59.000Z",
            "updated_date": "2023-06-23T12:05:59.000Z"
          }
        ]
      }
      ```

      ### Response (실패)
      ```json
      {
        "success": false,
        "message": "해당하는 사용자의 게시글이 존재하지 않습니다"
      }
      ```

  - ## 2.4: 게시글 제목 수정 API
    - URL: `"/post/:postId/title"`
    - Method: `PATCH`

      ### Request Type: `params`
      ### **바꾸고싶은 포스트의 pk**
      ```
      "/post/1/title"
      ```

      ### Request Type: `body`
      ```json
      {
        "userId": 1,
        "title": "제목 수정이요"
      }
      ```

      ### Response (성공)
      ```json
      {
        "success": true,
        "message": "수정 성공"
      }
      ```

      ### Response (실패)
      ```json
      {
        "success": false,
        "message": "수정 실패, 본인만 수정 가능"
      }
      ```

  - ## 2.5: 게시글 본문 수정 API
    - URL: `"/post/:postId/content"`
    - Method: `PATCH`

      ### Request Type: `params`
      ### **바꾸고싶은 포스트의 pk**
      ```
      "/post/1/content"
      ```

      ### Request Type: `body`
      ```json
      {
        "userId": 1,
        "content": "본문 수정이요"
      }
      ```

      ### Response (성공)
      ```json
      {
        "success": true,
        "message": "수정 성공"
      }
      ```

      ### Response (실패)
      ```json
      {
        "success": false,
        "message": "수정 실패, 본인만 수정 가능"
      }
      ```

  - ## 2.6: 게시글 전체 수정 API
    - URL: `"/post/:postId"`
    - Method: `PUT`

      ### Request Type: `params`
      ### **바꾸고싶은 포스트의 pk**
      ```
      "/post/1"
      ```

      ### Request Type: `body`
      ```json
      {
        "userId": 1,
        "title": "제목 수정이요",
        "content": "본문 수정이요"
      }
      ```

      ### Response (성공)
      ```json
      {
        "success": true,
        "message": "수정 성공"
      }
      ```

      ### Response (실패)
      ```json
      {
        "success": false,
        "message": "수정 실패, 본인만 수정 가능"
      }
      ```

  - ## 2.7: 게시글 삭제 API
    - URL: `"/post/:postId"`
    - Method: `DELETE`

      ### Request Type: `params`
      ### **삭제하고싶은 포스트의 pk**
      ```
      "/post/1"
      ```

      ### Request Type: `body`
      ```json
      {
        "userId": 1
      }
      ```

      ### Response (성공)
      ```json
      {
        "success": true,
        "message": "삭제 성공"
      }
      ```

      ### Response (실패)
      ```json
      {
        "success": false,
        "message": "삭제 실패, 본인만 삭제 가능"
      }
      ```
