import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component{
    state={
       orderFrom:{
        name: {
            elementType: 'input',
            elementConfig:{
                type: 'text',
                placeholder: 'Your name'
            },
            value: '',
            validation:{
                required: true
            },
            valid: false
        },
       street: {
            elementType: 'input',
            elementConfig:{
                type: 'text',
                placeholder: 'Your street'
            },
            value: '',
            validation:{
                required: true
            },
            valid: false
        },
        zipCode: {
            elementType: 'input',
            elementConfig:{
                type: 'text',
                placeholder: 'Your zip code'
            },
            value: '',
            validation:{
                required: true,
                minLength: 5,
                maxLength: 5
            },
            valid: false
        },
        counrty: {
            elementType: 'input',
            elementConfig:{
                type: 'text',
                placeholder: 'Your country'
            },
            value: '',
            validation:{
                required: true
            },
            valid: false
        },
        email: {
            elementType: 'input',
            elementConfig:{
                type: 'email',
                placeholder: 'Your email'
            },
            value: '',
            validation:{
                required: true
            },
            valid: false
        },
        deliveryMethod: {
            elementType: 'select',
            elementConfig: {
                options: [
                    {value: 'fastest', displayValue: 'Fastest'},
                    {value: 'cheapest', displayValue: 'Cheapest'}
                ]
            },
            value: ''
        },
    },
       
        loading: false
    }

    orderHandler = (event) =>{
        event.preventDefault();
        
        this.setState({loading: true});
        const formData = {};
        for(let formElementId in this.state.orderFrom){
            formData[formElementId] = this.state.orderFrom[formElementId].value;
        }
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formData
       }

        axios.post('/orders.json', order)
        .then(response=>{
            this.setState({loading: false})
            this.props.history.push('/');
        })
        .catch(error=>{
            this.setState({loading: false})
        });
    }

    checkValidity(value, rules){
        let isValid = true;
        if(rules.required){
            isValid = value.trim() !== '' && isValid;
        }
        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid
        }
        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid
        }
        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) =>{
        const updatedOrderForm = {
            ...this.state.orderFrom
        };
        const updatedFormElement= {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        console.log(updatedFormElement)
        this.setState({orderFrom: updatedOrderForm}) 
    }

    render(){
        const formElementsArray = [];
        for(let key in this.state.orderFrom){
            formElementsArray.push({
                id: key,
                config: this.state.orderFrom[key]
            })
        }
        
        let form = (
        <form onSubmit={this.orderHandler}>
            {formElementsArray.map(formElement=>(
                <Input 
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                changed={(event)=>this.inputChangedHandler(event, formElement.id)}/>
            ))}
            <Button btnType='Success'>Order</Button>
        </form>
        );
        if(this.state.loading){
            form= <Spinner />
        }
        return(
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData;