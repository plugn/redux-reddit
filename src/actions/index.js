export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'
export const REQUEST_TOPICS = 'REQUEST_TOPICS'
export const RECEIVE_TOPICS = 'RECEIVE_TOPICS'

export const selectSubreddit = subreddit => ({
  type: SELECT_SUBREDDIT,
  subreddit
})

export const invalidateSubreddit = subreddit => ({
  type: INVALIDATE_SUBREDDIT,
  subreddit
})

export const requestPosts = subreddit => ({
  type: REQUEST_POSTS,
  subreddit
})

export const receivePosts = (subreddit, json) => ({
  type: RECEIVE_POSTS,
  subreddit,
  posts: json.data.children.map(child => child.data),
  receivedAt: Date.now()
})

export const requestTopics = () => ({
  type: REQUEST_TOPICS
})

export const receiveTopics = (json) => {
  console.log('receiveTopics() json: ', json);

  const topics = json.data.children.map(v => v.data.display_name)
  console.log('topics: ', topics);

  return {
    type: RECEIVE_TOPICS,
    topics,
    rececivedAt: Date.now()
  }
}

export const fetchTopics = () => dispatch => {
  dispatch(requestTopics())
  return fetch('https://www.reddit.com/subreddits/default.json')
    .then(response => response.json())
    .then(json => dispatch(receiveTopics(json)))
}

const fetchPosts = subreddit => dispatch => {
  dispatch(requestPosts(subreddit))
  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then(response => response.json())
    .then(json => dispatch(receivePosts(subreddit, json)))
}

const shouldFetchPosts = (state, subreddit) => {
  const posts = state.postsBySubreddit[subreddit]
  if (!posts) {
    return true
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate
}

export const fetchPostsIfNeeded = subreddit => (dispatch, getState) => {
  if (shouldFetchPosts(getState(), subreddit)) {
    return dispatch(fetchPosts(subreddit))
  }
}
