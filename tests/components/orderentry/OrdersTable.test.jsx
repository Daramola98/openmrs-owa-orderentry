import React from 'react';
import configureStore from 'redux-mock-store';
import ConnectedOrdersTablePage, { OrdersTable } from '../../../app/js/components/orderEntry/OrdersTable';
import { rejects } from 'assert';


jest.mock('sweetalert', () => jest.fn((question, answer) => "YES"));


const mockStore = configureStore();

const {
  encounterRole,
  allConfigurations,
  sessionReducer,
  encounterType,
  orders,
  patient,
  careSetting,
  draftOrders,
  addedOrder,
  addedOrderError,
  items,
  itemName,
  freeTextOrder,
  standardDoseOrder,
} = mockData;

const mockDrugOrder = {
  date: "24/12/2018",
  display: "Paracetamol",
  type: "drugorder",
  dosingInstructions: "15mg of Amoxycillin syrup for the next 5 days",
  dispense: "25",
  activeDates: "25/08/2018 - 25/08/2019",
  orderer: {display: "Mark Goodrich"},
  status: "Active",
  uuid: 2,
  orderNumber: 22,
};

const mockLabOrder = {
  date: "24/12/2018",
  display: "Complete Blood Count",
  type: "testorder",
  activeDates: "25/08/2018 - 25/08/2019",
  orderer: {display: "Mark Goodrich"},
  status: "Active",
  uuid: 2,
  orderNumber: 22,
};

const props = {
  allConfigurations,
  filteredOrders: [
    {
      activeDates: '24/12/2018',
      display: 'Paracetamol',
      type: 'drugorder',
      dosingInstructions: '25mg of Amoxycillin syrup for the next 5 days',
      dispense: '45',
      orderer: { display: 'Mark Goodrich' },
      drug: {
        uuid: "502a2b2e-4659-4987-abbd-c50545dead47",
        display: "Paracetamol",
      },
      urgency: 'STAT',
      uuid: 2,
    },
    {
      activeDates: '24/12/2018',
      display: 'Paracetamol',
      type: 'testorder',
      orderer: { display: 'Mark Goodrich' },
      drug: {
        uuid: "502a2b2e-4659-4987-abbd-c50545dead47",
        display: "Paracetamol",
      },
      urgency: 'STAT',
      uuid: 2,
    },
  ],
  dateFormatReducer: { dateFormat: '', },
  status: {
    fetched: true,
  },
  patient: {
    patientId: 'some-random-id',
    uuid: 'some-random-id',
    patientIdentiier: { uuid: 'some-random-uuid' },
    person: { gender: 'M', age: 12, birthdate: '2006-08-08T00:00:00.000+0100' },
    personName: { display: 'joey bart' },
  },

  encounterType,
  encounterRole,
  careSettingReducer: { outpatientCareSetting: careSetting },
  sessionReducer: {
    ...sessionReducer,
    sessionLocation: 'drugs',
  },
  dispatch: jest.fn(),
};

let mountedComponent;
const getComponent = () => {
  if (!mountedComponent) {
    mountedComponent = shallow(<OrdersTable {...props} store={store} />);
  }
  return mountedComponent;
};

describe('Orders component test-suite', () => {
  it('renders properly', () => {
    const wrapper = mount(<OrdersTable {...props} />);
    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.find('Accordion').exists()).toBeTruthy();
    wrapper.setProps({
      ...wrapper.props(),
      patient: {
        uuid: 'some-random-id2',
      },
    });
    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.find('Accordion').exists()).toBeTruthy();
  });

  it('does not render any data if the result array is empty', () => {
    const store = mockStore({
      patientReducer: {
        patient: {
          patientId: 'some-random-id',
          uuid: 'some-random-id',
          patientIdentiier: { uuid: 'some-random-uuid' },
          person: { gender: 'M', age: 12, birthdate: '2006-08-08T00:00:00.000+0100' },
          personName: { display: 'joey bart' },
        },
      },
      openmrs: {
        session: {
          currentProvider: {
            uuid: '',
          },
        },
      },
      encounterReducer: {
        encounterType,
      },
      encounterRoleReducer: { encounterRole },
      careSettingReducer: { outpatientCareSetting: careSetting },
      fetchOrdersReducer: {
        filteredOrders: [],
        status: {
          fetched: true,
        },
      },
      dateFormatReducer: { dateFormat: '', }
    });
    const props = {
      location: { search: '?patient=esere_shbfidfb_343ffd' },
    };
    const wrapper = mount(<ConnectedOrdersTablePage store={store} {...props} />);
    expect(wrapper.find('.no-result-info').props().children).toEqual('No Orders');
  });
  
  it('handles editing of active orders', () => {

    const props = {
      filteredOrders: [
        {
            activeDates: "24/12/2018",
            display: "Paracetamol",
            type: "drugorder",
            dosingInstructions: "25mg of Amoxycillin syrup for the next 5 days",
            dispense: "45",
            orderer: {display: "Mark Goodrich"},
            urgency: "STAT",
            uuid: 2
        },
        {
            activeDates: "24/12/2018",
            display: "Paracetamol",
            type: "testorder",
            orderer: {display: "Mark Goodrich"},
            urgency: "STAT",
            uuid: 2
        }
      ],
      status: {
        fetched: true,
      },
      patient: {
        uuid: 'some-random-id',
      },
      dispatch: jest.fn()
    };

    const component = shallow(<OrdersTable {...props}/>);
    const componentInstance = component.instance();
    componentInstance.handleActiveOrderEdit(mockDrugOrder);
    expect(props.dispatch).toBeCalled();
  });
});

describe('getUUID() method', () => {
  it('should call getUUID()', () => {
    const renderedComponent = getComponent().instance();
    sinon.spy(renderedComponent, 'getUUID');
    renderedComponent.getUUID(items, itemName);
    expect(renderedComponent.getUUID.calledOnce).toEqual(true);
  });
});

describe('setDiscontinuedOrder method for drug orders', () => {
  it('should call setDiscontinuedOrder for drug orders', async (done) => {
    const renderedComponent = getComponent().instance();
    sinon.spy(renderedComponent, 'setDiscontinuedOrder');
    renderedComponent.setDiscontinuedOrder(mockDrugOrder);
    expect(renderedComponent.setDiscontinuedOrder.calledOnce).toEqual(true);
    done();
  });
});

describe('setDiscontinuedOrder method for lab orders', () => {
  it('should call setDiscontinuedOrder for lab orders', async (done) => {
    const renderedComponent = getComponent().instance();
    renderedComponent.setDiscontinuedOrder(mockLabOrder);
    expect(renderedComponent.setDiscontinuedOrder.calledTwice).toEqual(true);
    done();
  });
});

describe('discontinueOrder method', () => {
  it('should call discontinueOrder', async (done) => {
    const renderedComponent = getComponent().instance();
    sinon.spy(renderedComponent, 'discontinueOrder');
    renderedComponent.discontinueOrder(mockDrugOrder, 22);
    expect(renderedComponent.discontinueOrder.calledOnce).toEqual(true);
    expect(props.dispatch).toBeCalled();
    done();
  });
});
