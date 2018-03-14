import React, { Component } from 'react';
import axios from 'axios';

class Signup extends Component {
	constructor(props) {
		super(props) 
		this.state = {
			name: '',
			email: '',
			password: ''
		}
		this.handleNameChange = this.handleNameChange.bind(this)
		this.handleEmailChange = this.handleEmailChange.bind(this)
		this.handlePasswordChange = this.handlePasswordChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleNameChange(e) {
		this.setState({
			name: e.target.value
		})
	}
	handleEmailChange(e) {
		this.setState({
			email: e.target.value
		})
	}
	handlePasswordChange(e) {
		this.setState({
			password: e.target.value
		})
	}

	handleSubmit(e) {
		e.preventDefault()
		axios.post('/auth/signup', {
			name: this.state.name,
			email: this.state.email,
			password: this.state.password
		}).then(result => {
			//result.data is where axios puts the stuff 
			//that it gets back from the axios calls
			console.log(result.data)
			//this would be better named as something 
			//related to your app's name but whatever
			localStorage.setItem('mernToken', result.data.token)
			this.props.liftToken(result.data)
			//storing the user/email/pass in state, but 
			//storing the token in the localStorage.
		})
	}


	render() {

		return(
			<form className="signup" onSubmit={this.handleSubmit}>
				Name: <input type='text' value={this.state.name} onChange={this.handleNameChange} /><br/>
				Email: <input type='text' value={this.state.email} onChange={this.handleEmailChange} /><br/>
				Password: <input type='password' value={this.state.password} onChange={this.handlePasswordChange} />
				<input type='submit' value='Sign Up!' />
			</form>
		)

	}
}

export default Signup;