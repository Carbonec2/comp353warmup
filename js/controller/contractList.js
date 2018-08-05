//global variable to the page instance
var thisPage;

$(document).ready(() => {

    thisPage = new ContractList();

});

class ContractList {

    constructor() {

        this.bind();

        this.data = [];
        //this.data.push({firstname: 'Bob', province: 'Québec'});

        this.buildTable();

        this.fetchData();
    }

    bind() {

        $("#formSubmit").click(() => {
            this.formSubmit();
        });
    }

    buildTable() {
        this.handsontable = new Handsontable($('#contractListHandsontable')[0], {
            data: this.data,
            colHeaders: ['Company Name', 'Manager', 'Annual Contract Value', 'Initial Amount',
                'Service Start Date', 'Service End Date', 'Platform Type', 'Contract Type', 'Client Satisfaction Score (0-10)'],
            rowHeaders: true,
            columns: [
                {data: 'companyName', type: 'dropdown', source: this.fetchCompanyList},
                {data: 'managerName', type: 'dropdown', source: this.fetchManagerList},
                {data: 'annualContractValue', type: 'numeric',
                    numericFormat: {
                        pattern: '$0,0.00',
                        culture: 'en-US'
                    }},
                {data: 'initialAmount', type: 'numeric',
                    numericFormat: {
                        pattern: '$0,0.00',
                        culture: 'en-US'
                    }},
                {data: 'serviceStartDate', type: 'date'},
                {data: 'serviceEndDate', type: 'date'},
                {data: 'platformType', type: 'dropdown', source: this.fetchPlatformType},
                {data: 'contractType', type: 'dropdown', source: this.fetchContractType},
                {data: 'satisfactionScore', type: 'numeric', validator: /^[0-9]$|^10$/} //0 to 10 with this regex
            ],
            minSpareRows: 1,
            beforeChange: (changes, source) => {
                //Only triggered when we change a cell after filling the table
                //We cannot reference this method as a pointer to the method, since we would loose the lexical 'this'

                //[0][row, prop, oldValue, newValue]
            },
            stretchH: "all"
        });

    }

    adjustTableRole() {


        /*
         switch ($_SESSION['roleType']) {
         case 'Manager':
         //He must see all contracts to be able to allocate employees on it 
         //(Many to many, so a link on every contract to a contract allocation page (ContractAssignment table)
         break;
         case 'Sales Associate':
         //He must see all contracts + can assign a contract manager
         break;
         case 'Employee':
         //Nothing to see here
         return;
         break;
         case 'Admin':
         //Can see and update everything
         //Can remove everything
         break;
         }
         */







        //Set by head.php
        switch (globalRole) {
            case 'Client':
                //The client only sees its contract, and can't create other ones
                this.handsontable.updateSettings({
                    minSpareRows: 0, //Lock the table to a max number of rows
                    maxRows: this.data.length, //Lock the table to a max number of rows
                    columns: [
                        {data: 'companyName', type: 'dropdown', source: this.fetchCompanyList, className: 'htDimmed', readOnly: true},
                        {data: 'managerName', type: 'dropdown', source: this.fetchManagerList, className: 'htDimmed', readOnly: true},
                        {data: 'annualContractValue', type: 'numeric',
                            numericFormat: {
                                pattern: '$0,0.00',
                                culture: 'en-US'
                            },
                            className: 'htDimmed',
                            readOnly: true},
                        {data: 'initialAmount', type: 'numeric',
                            numericFormat: {
                                pattern: '$0,0.00',
                                culture: 'en-US'
                            },
                            className: 'htDimmed',
                            readOnly: true},
                        {data: 'serviceStartDate', type: 'date', className: 'htDimmed', readOnly: true},
                        {data: 'serviceEndDate', type: 'date', className: 'htDimmed', readOnly: true},
                        {data: 'platformType', type: 'dropdown', source: this.fetchPlatformType, className: 'htDimmed', readOnly: true},
                        {data: 'contractType', type: 'dropdown', source: this.fetchContractType, className: 'htDimmed', readOnly: true},
                        {data: 'satisfactionScore', type: 'numeric', validator: /^[0-9]$|^10$/} //0 to 10 with this regex
                    ]
                });
                break;
            case 'Manager':
                //He must see all contracts he is attached to in order to be able to allocate employees on it 
                //(Many to many, so a link on every contract to a contract allocation page (ContractAssignment table)
                //Link somewhere to the Employee association tool and employee hours tool?
                this.handsontable.updateSettings({
                    minSpareRows: 0, //Lock the table to a max number of rows
                    maxRows: this.data.length, //Lock the table to a max number of rows
                    columns: [
                        {data: 'companyName', type: 'dropdown', source: this.fetchCompanyList, className: 'htDimmed', readOnly: true},
                        {data: 'managerName', type: 'dropdown', source: this.fetchManagerList, className: 'htDimmed', readOnly: true},
                        {data: 'annualContractValue', type: 'numeric',
                            numericFormat: {
                                pattern: '$0,0.00',
                                culture: 'en-US'
                            },
                            className: 'htDimmed',
                            readOnly: true},
                        {data: 'initialAmount', type: 'numeric',
                            numericFormat: {
                                pattern: '$0,0.00',
                                culture: 'en-US'
                            },
                            className: 'htDimmed',
                            readOnly: true},
                        {data: 'serviceStartDate', type: 'date', className: 'htDimmed', readOnly: true},
                        {data: 'serviceEndDate', type: 'date', className: 'htDimmed', readOnly: true},
                        {data: 'platformType', type: 'dropdown', source: this.fetchPlatformType, className: 'htDimmed', readOnly: true},
                        {data: 'contractType', type: 'dropdown', source: this.fetchContractType, className: 'htDimmed', readOnly: true},
                        {data: 'satisfactionScore', type: 'numeric', validator: /^[0-9]$|^10$/, className: 'htDimmed', readOnly: true} //0 to 10 with this regex
                    ]
                });
                break;
            case 'Admin':
                //Can see and update everything
                //Can remove everything
                this.handsontable.updateSettings({
                    minSpareRows: 0, //Lock the table to a max number of rows
                    maxRows: this.data.length, //Lock the table to a max number of rows
                    columns: [
                        {data: 'companyName', type: 'dropdown', source: this.fetchCompanyList},
                        {data: 'managerName', type: 'dropdown', source: this.fetchManagerList},
                        {data: 'annualContractValue', type: 'numeric',
                            numericFormat: {
                                pattern: '$0,0.00',
                                culture: 'en-US'
                            }
                        },
                        {data: 'initialAmount', type: 'numeric',
                            numericFormat: {
                                pattern: '$0,0.00',
                                culture: 'en-US'
                            }
                        },
                        {data: 'serviceStartDate', type: 'date'},
                        {data: 'serviceEndDate', type: 'date'},
                        {data: 'platformType', type: 'dropdown', source: this.fetchPlatformType},
                        {data: 'contractType', type: 'dropdown', source: this.fetchContractType},
                        {data: 'satisfactionScore', type: 'numeric', validator: /^[0-9]$|^10$/} //0 to 10 with this regex
                    ]
                });
                break;
            case 'Sales Associate':
                //Can associate a contract manager and modify everything
                this.handsontable.updateSettings({
                    minSpareRows: 0, //Lock the table to a max number of rows
                    maxRows: this.data.length, //Lock the table to a max number of rows
                    columns: [
                        {data: 'companyName', type: 'dropdown', source: this.fetchCompanyList},
                        {data: 'managerName', type: 'dropdown', source: this.fetchManagerList},
                        {data: 'annualContractValue', type: 'numeric',
                            numericFormat: {
                                pattern: '$0,0.00',
                                culture: 'en-US'
                            }
                        },
                        {data: 'initialAmount', type: 'numeric',
                            numericFormat: {
                                pattern: '$0,0.00',
                                culture: 'en-US'
                            }
                        },
                        {data: 'serviceStartDate', type: 'date'},
                        {data: 'serviceEndDate', type: 'date'},
                        {data: 'platformType', type: 'dropdown', source: this.fetchPlatformType},
                        {data: 'contractType', type: 'dropdown', source: this.fetchContractType},
                        {data: 'satisfactionScore', type: 'numeric', validator: /^[0-9]$|^10$/} //0 to 10 with this regex
                    ]
                });
                break;
        }
    }

    /**
     * Fetch data from the database
     * @returns {undefined}
     */
    fetchData() {

        contractTDG.getContractTable((contractTableResult) => {

            console.log(contractTableResult);
            this.data = contractTableResult;
            this.handsontable.updateSettings({
                data: this.data
            });

            this.adjustTableRole();

            this.handsontable.render();
        });

        this.fetchManagerList();
    }

    /**
     * Handsontable dropdown source handler
     * @param {type} query
     * @param {type} process
     * @returns {undefined}
     */
    fetchContractType(query, process) {

        contractTypeTDG.getAllNames((result) => {
            process(result);
        });
    }

    /**
     * Handsontable dropdown source handler
     * @param {type} query
     * @param {type} process
     * @returns {undefined}
     */
    fetchPlatformType(query, process) {

        platformTypeTDG.getAllNames((result) => {
            process(result);
        });
    }

    fetchCompanyList(query, process) {

        clientTDG.getClientHashtable((result) => {

            this.clientNameToId = result.nameToId;
            this.clientIdToName = result.idToName;

            let names = Object.keys(this.clientNameToId);

            console.log(names);

            if (typeof (process) === "function") {
                process(names);
            }
        });
    }

    fetchManagerList(query, process) {

        employeeTDG.getManagerHashtable((result) => {
            this.nameToId = result.nameToId;
            this.idToName = result.idToName;

            let names = Object.keys(this.nameToId);

            console.log(names);

            if (typeof (process) === "function") {
                process(names);
            }
        });
    }

    getPageData() {

        let data = this.handsontable.getSourceData();

        for (let i = 0; i < data.length; i++) {

            data[i].managerId = this.nameToId[data[i].managerName];
            data[i].clientId = this.clientNameToId[data[i].companyName];

        }

        return this.handsontable.getSourceData();
    }

    formSubmit() {

        console.log(this.getPageData());

        contractTDG.saveContractTable(this.getPageData(), (result) => {

            console.log(result);

            //this.fetchData(); //We reload the table

        });
    }
}
