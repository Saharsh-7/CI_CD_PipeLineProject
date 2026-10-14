import { LightningElement, track } from 'lwc';
import getPicklistValues from '@salesforce/apex/AppointmentController.getPicklistValues';
import addPicklistValue from '@salesforce/apex/AppointmentController.addPicklistValue';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const ADD_NEW_OPTION_VALUE = '__ADD_NEW__';

export default class AppointmentStatusManager extends LightningElement {
    @track picklistOptions = [];
    selectedStatus = '';
    previousStatus = '';
    newStatus = '';
    isLoading = false;
    showAddInput = false;

    connectedCallback() {
        this.loadPicklistValues();
    }

    async loadPicklistValues() {
        this.isLoading = true;
        try {
            const data = await getPicklistValues();
            // Append the '+ Add New' action right inside the dropdown list
            this.picklistOptions = [
                ...data,
                { label: '+ Add New Status...', value: ADD_NEW_OPTION_VALUE }
            ];
        } catch (error) {
            this.showToast('Error loading values', this.extractError(error), 'error');
        } finally {
            this.isLoading = false;
        }
    }

    handleSelectionChange(event) {
        const chosenValue = event.detail.value;

        if (chosenValue === ADD_NEW_OPTION_VALUE) {
            // Show the input field and button when '+ Add New Status...' is clicked
            this.selectedStatus = ADD_NEW_OPTION_VALUE;
            this.showAddInput = true;
        } else {
            this.selectedStatus = chosenValue;
            this.previousStatus = chosenValue;
            this.showAddInput = false;
            this.newStatus = '';
        }
    }

    handleCancelAdd() {
        this.showAddInput = false;
        this.newStatus = '';
        this.selectedStatus = this.previousStatus;
    }

    handleStatusChange(event) {
        this.newStatus = event.target.value.trim();
    }

    async handleAddStatus() {
        if (!this.newStatus) {
            this.showToast('Warning', 'Please enter a status value.', 'warning');
            return;
        }

        this.isLoading = true;
        try {
            await addPicklistValue({ statusValue: this.newStatus });
            this.showToast('Success', `Added "${this.newStatus}" to Status picklist!`, 'success');
            
            const addedValue = this.newStatus;
            this.newStatus = '';
            this.showAddInput = false;
            await this.loadPicklistValues();
            this.selectedStatus = addedValue;
            this.previousStatus = addedValue;
        } catch (error) {
            this.showToast('Error adding status', this.extractError(error), 'error');
        } finally {
            this.isLoading = false;
        }
    }

    extractError(error) {
        return error?.body?.message || error?.message || 'An unknown error occurred.';
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}