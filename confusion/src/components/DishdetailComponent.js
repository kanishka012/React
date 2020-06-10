import React,{Component} from 'react';
import {Card, CardImg,CardText,CardBody,CardTitle,BreadcrumbItem,Breadcrumb,Button,Modal,ModalHeader,ModalBody,Row,Col, Label} from 'reactstrap';
import {Link} from 'react-router-dom';
import {LocalForm,Control,Errors} from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component{
    constructor(props){
        super(props);

        this.state={
            isModalOpen: false
        }
        this.toggleModal=this.toggleModal.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }

    toggleModal()
    {
        this.setState({isModalOpen:! this.state.isModalOpen});
    }
    handleSubmit(values){
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
        this.toggleModal();
    }
    

    render(){
        return(
            <div>
                <Button outline onClick={this.toggleModal}>
                    <span class="fa fa-pencil fa-lg" ></span> Submit Comment
                </Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit</ModalHeader>
                    <ModalBody>
                    <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                        <Row className="form-group">
                                <Label htmlFor="rating" md={2}>Rating</Label>
                                <Col md={10}>
                                    <Control.select model=".rating" id="rating" name="rating"
                                        className="form-control">
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="author" md={12}>Your Name</Label>
                                <Col md={12}>
                                    <Control.text model=".author" id="author" name="author"
                                        placeholder="Your Name"
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                         />
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                     />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment" md={12}>Comments</Label>
                                <Col md={12}>
                                <Control.textarea model=".comment" class="form-control" name="comment" id="comment" rows="6"/>
                                        
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col md={12}>
                            <Button type="submit" value="submit" color="primary">Submit</Button>
                                </Col>
                            </Row>
                        </LocalForm>
                            
                     
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

function RenderDish({dish}){
    if(dish!=null){
        return(
            <div className="col-12 col-md-5 m-1">
                <FadeTransform
                    in
                    transformProps={{
                        exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>                
                </Card>
                </FadeTransform>
            </div>
            
        );
    }
    else{
        return (
            <div></div>
            );
    }
}

function RenderComments({comments, postComment, dishId}){
    if(comments!=null){
        const content=comments.map((comment)=>{
            return(
                <li key={comment.id}>
                    <p>{comment.comment}</p>
                    <p>-- {comment.author} , 
                    &nbsp;
                    {new Intl.DateTimeFormat('en-US',{
                         year:'numeric',
                         month:'short',
                         day:'2-digit'
                    }).format(new Date(Date.parse(comment.date)))}
                    </p>
                </li>
            );
        })
        return(
        <div className="col-12 col-md-5 m-1">
            <h4>Comments</h4>
            <ul className="list-unstyled">
             <Stagger in>
                        {comments.map((comment) => {
                            return (
                                <Fade in>
                                <li key={comment.id}>
                                <p>{comment.comment}</p>
                                <p>-- {comment.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                                </li>
                                </Fade>
                            );
                        })}
            </Stagger>
            </ul>
            <CommentForm dishId={dishId} postComment={postComment} />
        </div>
        );
    }
    else{
        return <div></div> ;
    }
}


const Dishdetail=(props)=>{
    const dish=props.dish;
    const comments=props.comments;
    if (props.isLoading) {
        return(
            <div className="container">
                <div className="row">            
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.errMess) {
        return(
            <div className="container">
                <div className="row">            
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }
    
    else if(dish!=null){
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr/>
                    </div>
                </div>
                <div className="row">
                    <RenderDish dish={dish} />
                    <RenderComments comments={comments}
                        postComment={props.postComment}
                        dishId={props.dish.id}
                    />
                </div>
            </div>
        );
    }
    else{
        return(
            <div></div>
        );
    }
}


export default Dishdetail;