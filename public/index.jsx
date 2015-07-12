var staus = function(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
};

var json = function(response) {
  return response.json()
};

var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []}
  },
  loadCommentsFromServer: function() {
    var self = this;
    fetch(this.props.url)
      .then(status)
      .then(json)
      .then(function(comments) {
        self.setState({data: comments})
      })
  },
  handleCommentSubmit: function(comment) {
    var self = this;
    fetch(this.props.url, {
      method: 'POST',
      body: JSON.stringify(comment)
    })
      .then(status)
      .then(json)
      .then(function(comment) {
        self.state.data.push(comment);
        self.setState({data: self.state.data});
      });
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (<div className="commentBox">
      <h1>Comments</h1>
      <CommentList data={this.state.data}/>
      <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
    </div>);
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return <Comment author={comment.author}>
        {comment.text}
      </Comment>
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        {this.props.children}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post"/>
      </form>
    );
  }
});
React.render(
  <CommentBox url="comments" pollInterval={2000}/>,
  document.getElementById('content')
);