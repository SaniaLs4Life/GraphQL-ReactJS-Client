import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { getAuthorsQuery, addBookMutation, getBooksQuery } from '../queries/queries'
import { Modal, Button, Input, Alert  } from 'antd'

class AddBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            genre: '',
            authorId: '',
            visible: false,
            error: false
        }
        this.submitForm = this.submitForm.bind(this)
    }
    handleOnChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    showModal = () => {
        this.setState({
            name: '',
            genre: '',
            authorId: '',
            visible: true       
        });
      }
    
      handleOk = (e) => {
        this.submitForm()
        console.log(e);
      }
    
      handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false      
        });
      }
    displayAuthors = () => {
        var data = this.props.getAuthorsQuery;
        if(data.loading) {
            return(
                <option disabled>Loading Authors...</option>
            )
        } else {
            return data.authors.map(author => {
                return (
                    <option key={author.id} value={author.id}>{author.name}</option>
                )
            });
        }
    }
    submitForm() {
        console.log(this.state);
        if(this.state.name && this.state.genre && this.state.authorId) {
            this.props.addBookMutation({
                variables: {
                    name: this.state.name,
                    genre: this.state.genre,
                    authorId: this.state.authorId
                },
                refetchQueries: [
                    {
                        query: getBooksQuery
                    }
                ]
            });            
            this.setState({
                visible: false,
                error: false   
            });
        } else {
            this.setState({
                error: true
            })
        }
    }
    render() {
        return (
            <div style={{margin: 'auto', textAlign: 'center', marginTop: '15px'}}>
                <Button type="primary" onClick={this.showModal}>
                Add a book
                </Button>
                <Modal
                title="Add a book"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                >
                <p>
                <form id="add-book" >
                <div className="field">
                    <Input type="text" placeholder="Book name" name="name" onChange={ this.handleOnChange } />
                </div><br />
                <div className="field">
                    <Input type="text" placeholder="Genre" name="genre" onChange={ this.handleOnChange } />
                </div><br />
                <div className="field">
                    <select onChange={ this.handleOnChange } name="authorId" style={{padding: '5px', borderRadius: '3px', borderColor: '#DDD', outline: 'none', width: '100%'}}>
                        <option disabled>Select an author</option>
                        {
                            this.displayAuthors()
                        }
                    </select>
                </div>
            </form>
                </p>
                {
                    this.state.error ?
                        <Alert message="Please fill the form!" type="error" />
                    :
                        null

                }
                </Modal>
            </div>
            
        )
    }
}

export default compose(
    graphql(getAuthorsQuery, { name: 'getAuthorsQuery' }),
    graphql(addBookMutation, { name: 'addBookMutation' })
)(AddBook)