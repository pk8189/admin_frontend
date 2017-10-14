import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  FormGroup,
  FormControl,
  ControlLabel,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import { invokeApig, s3Upload, } from '../libs/awsLib';
import config from '../config.js';
import './Quizzes.css';


class Quizzes extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      quiz: null,
      category: '',
      quizName: '',
      subject: '',
      image: '',
      questions: ''
    };
  }

  async componentDidMount() {
    try {
      const results = await this.getQuiz();
      this.setState({
        quiz: results,
        category: results.category,
        quizName: results.quizName,
        subject: results.subject,
        image: results.image,
        questions: results.questions,

      });
    }
    catch(e) {
      console.log(e);
      alert(e);
    }
  }

  getQuiz() {
    return invokeApig({ path: `/quizzes1/${this.props.match.params.id}` }, this.props.userToken);
  }

  saveQuiz(quiz) {
    return invokeApig({
      path: `/quizzes1/${this.props.match.params.id}`,
      method: 'PUT',
      body: quiz,
    }, this.props.userToken);
  }

  deleteQuiz() {
    return invokeApig({
      path: `/quizzes1/${this.props.match.params.id}`,
      method: 'DELETE',
    }, this.props.userToken);
  }

  validateForm() {
    return this.state.quizName.length > 0;
  }

  formatFilename(str) {
    return (str.length < 50)
      ? str
      : str.substr(0, 20) + '...' + str.substr(str.length - 20, str.length);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  handleCChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  handleSChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = (event) => {
    this.file = event.target.files[0];
  }

  handleSubmit = async (event) => {
    let uploadedFilename;

    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert('Please pick a file smaller than 5MB');
      return;
    }

    this.setState({ isLoading: true });

    try {

      if (this.file) {
        uploadedFilename = (await s3Upload(this.file, this.props.userToken)).Location;
      }

      await this.saveQuiz({
        ...this.state.quiz,
        quizName: this.state.quizName,
        category: this.state.category,
        subject: this.state.subject,
        image: uploadedFilename || this.state.quiz.image,
        questions: this.state.questions
      });
      this.props.history.push('/');
    }
    catch(e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  handleDelete = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm('Are you sure you want to delete this quiz?');

    if ( ! confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.deleteQuiz();
      this.props.history.push('/');
    }
    catch(e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  openQuestions = async (event) => {
    let uploadedFilename;

    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert('Please pick a file smaller than 5MB');
      return;
    }

    this.setState({ isOpening: true });

    try {

      if (this.file) {
        uploadedFilename = (await s3Upload(this.file, this.props.userToken)).Location;
      }

      await this.saveQuiz({
        ...this.state.quiz,
        quizName: this.state.quizName,
        category: this.state.category,
        subject: this.state.subject,
        image: uploadedFilename || this.state.quiz.image,
        questions: this.state.questions
      });

      this.props.history.push(`/quiz/questions/${this.state.quiz.quizId}`);
    }
    catch(e) {
      alert(e);
      this.setState({ isOpening: false });
    }

  }

  render() {

    return (
      <div className="Quizzes">
        { this.state.quiz &&
          ( <form onSubmit={this.handleSubmit}>
              <FormGroup controlId="quizName">
                <ControlLabel>Quiz Name </ControlLabel>
                <FormControl
                  onChange={this.handleChange}
                  value={this.state.quizName}
                  type="text" />
              </FormGroup>
              <FormGroup controlId="category">
                <ControlLabel>Category </ControlLabel>
                <FormControl
                  onChange={this.handleCChange}
                  value={this.state.category}
                  componentClass="select" >
                    <option value="SAT">SAT</option>
                    <option value="ACT">ACT</option>  
                </FormControl>     
              </FormGroup>
              <FormGroup controlId="subject">
                <ControlLabel>Subject </ControlLabel>
                <FormControl
                  onChange={this.handleSChange}
                  value={this.state.subject}
                  componentClass="select" >
                    {this.subjectHandler}
                    <option value="math">Math</option>
                    <option value="english">English</option>
                    <option value="reading/writing">Reading/Writing</option>  
                </FormControl>     
          </FormGroup>
              { this.state.quiz.image &&
              ( <FormGroup>
                <ControlLabel>Image</ControlLabel>
                <FormControl.Static>
                  <a target="_blank" rel="noopener noreferrer" href={ this.state.quiz.image }>
                    { this.formatFilename(this.state.quiz.image) }
                  </a>
                </FormControl.Static>
              </FormGroup> )}
              <FormGroup controlId="file">
                { ! this.state.quiz.image &&
                <ControlLabel>Image</ControlLabel> }
                <FormControl
                  onChange={this.handleFileChange}
                  type="file" />
              </FormGroup>

              <LoaderButton
                block
                bsStyle="info"
                bsSize="large"
                isLoading={this.state.isOpening}
                onClick={this.openQuestions}
                  text="Edit Questions"
                  loadingText="Opening Questions..." />

              <LoaderButton
                block
                bsStyle="primary"
                bsSize="large"
                disabled={ ! this.validateForm() }
                type="submit"
                isLoading={this.state.isLoading}
                text="Save"
                loadingText="Saving…" />
              <LoaderButton
                block
                bsStyle="danger"
                bsSize="large"
                isLoading={this.state.isDeleting}
                onClick={this.handleDelete}
                  text="Delete"
                  loadingText="Deleting…" />
            </form> )}
        </div>
      );
  }

}

export default withRouter(Quizzes);