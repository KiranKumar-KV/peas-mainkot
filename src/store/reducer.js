
const initialState = {
    age:20,
    itemArray:[],
    priceArray:[],
    idArray:[],
    quantityArray:[],
    qidArray:[],
    qtypeArray:[],
    noteAll:[],
    selectedItems:[],
    items_total_price:0,
    routeType:'',
    note_options:[]
};
let nodeHold=[];
const reducer = (state=initialState, action) => {
    const newState = {...state};

    switch(action.type)
    {
        case 'test':
                    newState.itemArray=action.names;
                    newState.priceArray=action.prices;
                    newState.idArray=action.ids;
                    newState.quantityArray=action.quantitys;
                    newState.qidArray=action.qids;
                    newState.qtypeArray=action.qtypes;
                  break;
        case 'note':
                     nodeHold=action.note;
                     newState.noteAll.push(nodeHold);
        case 'select':
                        newState.selectedItems=action.selectedItems
                        newState.items_total_price=0
                        action.selectedItems.map(item=>{
                            newState.items_total_price=newState.items_total_price+(item.item_price*item.quantity)
                        })
        case 'rtype': 
                        newState.routeType=action.rtype;
        break;
        case 'note_save': newState.note_options=action.note;
        break;
    }
    return newState;
};

export default reducer;