// @ts-check

// 프레임워크 없이 간단한 토이프로젝트 웹서버 만들어보기

/*
 * 블로그 포스팅 서비스
 * - 로컬 파일을 데이터베이스로 활용할 예정 (JSON)
 * - 인증 로직은 넣지 않는다.
 * - RESTful API를 사용한다.
 */

const http = require('http')

// jsdoc을 사용하여 post에 다른 컨텐츠가 없을 시 검사에 유용하게 해준다.
/**
 * @typedef Post
 * @property {string} id
 * @property {string} title
 * @property {string} content
 */

// 토이프로젝트를 위한 간단한 데이터베이스
/** @type {Post[]} */ // 위 jsdoc 적용
const posts = [
  {
    id: '1',
    title: 'My first post',
    content: 'Hello',
  },
  {
    id: '1',
    title: 'My second post',
    content: 'Hello',
  },
]

/*
 * GET /posts
 * GET /posts/:id
 * POST /posts
 */
const server = http.createServer((req, res) => {
  const POST_ID_REGEX = /^\/posts\/([a-zA-Z0-9-_]+)$/ // 정규식 캡쳐기능 사용
  const postIdRegexResult =
    (req.url && POST_ID_REGEX.exec(req.url)) || undefined

  // 분기문을 통해 그룹을 나눠준다.
  if (req.url === '/posts' && req.method === 'GET') {
    const result = {
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
      })),
      totalCount: posts.length,
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json; charset=utf-8') // 데이터가 json형태라고 알려주기 위해 추가
    res.end(JSON.stringify(result))
  } else if (postIdRegexResult && req.method === 'GET') {
    // GET /posts/:id
    const postId = postIdRegexResult[1]
    const post = posts.find((_post) => _post.id === postId)

    if (post) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(post))
    } else {
      res.statusCode = 404
      res.end('Post not found.')
    }
  } else if (req.url === '/posts' && req.method === 'POST') {
    req.setEncoding('utf-8')
    req.on('data', (data) => {
      /**
       * @typedef CreatePostBody
       * @property {string} title
       * @property {string} content
       */

      /** @type {CreatePostBody} */
      const body = JSON.parse(data)
      posts.push({
        id: String(posts.length + 1),
        title: body.title,
        content: body.content,
      })
    })

    res.statusCode = 200
    res.end('POST posts')
  } else {
    res.statusCode = 404
    res.end('Not found.')
  }
})

const PORT = 4000

server.listen(PORT, () => {
  console.log(`The server is listening at port: ${PORT}`)
})
