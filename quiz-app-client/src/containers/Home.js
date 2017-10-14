import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import './Home.css';
import {
  Jumbotron,
  PageHeader,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import { invokeApig } from '../libs/awsLib';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      quizzes: [],
    };
  }

  async componentDidMount() {
    if (this.props.userToken === null) {
      return;
    }

    this.setState({ isLoading: true });

    try {
      const results = await this.quizzes();
      this.setState({ quizzes: results });
    }
    catch(e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  quizzes() {
    return invokeApig({ path: '/quizzes1' }, this.props.userToken);
  }

  handleQuizClick = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  renderQuizList(quizzes) {
    return [{}].concat(quizzes).map((quiz, i) => (
      i !== 0
        ? ( <ListGroupItem
              key={quiz.quizId}
              href={`/quiz/${quiz.quizId}`}
              onClick={this.handleQuizClick}
              header={quiz.quizName}>
                { "Created: " + (new Date(quiz.createdAt)).toLocaleString() }
            </ListGroupItem> )
        : ( <ListGroupItem
              key="new"
              href="/quiz/new"
              onClick={this.handleQuizClick}>
                <h4><b>{'\uFF0B'}</b> Create a new quiz</h4>
            </ListGroupItem> )
    ));
  }

  renderLander() {
    return (
        <div className="lander">
          <Jumbotron>
          <h1>Welcome to Nabu</h1>
          <p>An SAT/ACT Prep App</p>
          <Link to="/login" className="btn btn-info btn-lg">Login</Link>
          <Link to="/" className="btn btn-success btn-lg">Signup</Link>
          </Jumbotron>
        </div>
    );
  }
  renderQuizzes() {
    return (
      <div className="quizzes">
        <PageHeader>Your Quizzes</PageHeader>
        <ListGroup>
          { ! this.state.isLoading
            && this.renderQuizList(this.state.quizzes) }
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        { this.props.userToken === null
          ? this.renderLander()
          : this.renderQuizzes() }
      </div>
    );
  }


}
export default withRouter(Home);