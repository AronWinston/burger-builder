import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import Modal from '../../components/UI/Modal/Modal';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';


const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 1.25,
    cheese: 0.5,
    meat: 2
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount(){
        axios.get('https://react-my-burger-5a9e1.firebaseio.com/ingredients.json')
        .then(response => {
            this.setState({ingredients: response.data});
            
        })
        .catch(error => {
            this.setState({error: true})
        })
    }

    updatePurchaseState (ingredients){
       

        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey];
        })
        .reduce((sum, el)=>{
            return sum + el;
        }, 0);
        this.setState({purchasable: sum > 0})
    }
    
    
    // Alternative way to use State
    // constructor(props){
    //     super(props);
    //     this.state = {...};
    // }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({totalPrice:newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    };

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <=0){
            return;
        };
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;

        this.setState({totalPrice:newPrice, ingredients: updatedIngredients});

        this.updatePurchaseState(updatedIngredients);
    };

    purchaseHandler = () => {
        this.setState({purchasing:true})
    }

    purchaseCancelledHandler = () => {
        this.setState({purchasing: false})
    };

    purchaseContinueHandler = () => {
        //alert('Continuing...');
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Aron Winston',
                address: {
                    number: 6,
                    street: 'Ritz Place',
                    city: 'Lindenhurst'
                },
                email: 'test1@gmail'
            },
            deliveryMethod: 'fastest'
        }

        axios.post('/orders.json', order)
        .then(response=>{
            this.setState({loading: false, purchasing: false})
        })
        .catch(error=>{
            this.setState({loading: false, purchasing: false})
        });
    };

    render(){
        const disableInfo ={
            ...this.state.ingredients
        };
        for (let key in disableInfo){
            disableInfo[key] = disableInfo[key] <= 0
        }
        

        let orderSummary = null;

        let burger = this.state.error? <p> Ingredients cant be loaded!</p> : <Spinner />
        
        if(this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients = {this.state.ingredients}/>
                    <BuildControls 
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disableInfo}
                    price={this.state.totalPrice}
                    purchasable={!this.state.purchasable}
                    ordered={this.purchaseHandler}/>
                </Aux>
                );

            orderSummary =   <OrderSummary 
            ingredients={this.state.ingredients}
            purchaseCancelled={this.purchaseCancelledHandler}
            purchaseContinued={this.purchaseContinueHandler}
            totalPrice = {this.state.totalPrice}/>
        }

        if(this.state.loading){
            orderSummary = <Spinner />
        }
        
     

        return(
            <Aux>
                <Modal 
                show={this.state.purchasing}
                modalClosed={this.purchaseCancelledHandler}>
                  {orderSummary}
                </Modal>
                {burger}
             </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);