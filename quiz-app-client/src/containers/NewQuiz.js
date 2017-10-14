import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';
import { invokeApig, s3Upload } from '../libs/awsLib';
import LoaderButton from '../components/LoaderButton';
import config from '../config.js';
import './NewQuiz.css';


class NewQuiz extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      category: 'SAT',
      quizName: '',
      subject: 'math',
    };
  }

  validateForm() {
    return this.state.quizName.length > 0;
  }

  createQuiz(quiz) {
    return invokeApig({
      path: '/quizzes1',
      method: 'POST',
      body: quiz,
    }, this.props.userToken);
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
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert('Please pick a file smaller than 5MB');
      return;
    }

    this.setState({ isLoading: true });

    try {
      const uploadedFilename = (this.file)
        ? (await s3Upload(this.file, this.props.userToken)).Location
        : null;

      await this.createQuiz({
        quizName: this.state.quizName,
        category: this.state.category,
        subject:  this.state.subject,
        image: uploadedFilename,
      });
      this.props.history.push('/');
    }
    catch(e) {
      console.log(e);
      alert(e);
      this.setState({ isLoading: false });
    }

  }



  render() {

    return (
      <div className="NewQuiz">
        <form onSubmit={this.handleSubmit}>
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

          <FormGroup controlId="file">
            <ControlLabel>Image</ControlLabel>
            <FormControl
              onChange={this.handleFileChange}
              type="file" />
          </FormGroup>

          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={ ! this.validateForm() }
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating…" />
        </form>
      </div>

    );
  }
}

export default withRouter(NewQuiz);