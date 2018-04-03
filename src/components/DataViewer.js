import React, { Component } from 'react';

import { Input, Accordion } from 'semantic-ui-react'

class DataViewer extends Component {
    getArrays = (docs) => {
        let result = [];

        for (const docNo in docs) {
            const doc = docs[docNo];

            if (doc instanceof Array) {
                result.push(this.getArrays(doc));
            }
            else if (doc instanceof Object) {
                result.push(this.getFields(doc));
            }
            else {
                result.push(<div> { doc } </div>)
            }
        }

        return result;
    };

    getFields = (doc) => {
        let result = [];

        for (const fieldNo in Object.keys(doc)) {
              const field = Object.keys(doc)[fieldNo];
              const value = doc[field];

              // Array
              if (value instanceof Array) {
                  this.getArrays(value);
              }
              else if (value instanceof Object) {
                  // console.log(value);
                  // Reference https://github.com/facebook/react/issues/1545
                  // Display curly brackets in html component
                  // result.push(<div> <strong> {field}: </strong> {'{'} {this.getFields(value)} {'}'} </div>);
                  result.push(<Accordion.Accordion>);
                      result.push(<Accordion.Title> {field} </Accordion.Title>);
                      result.push( {this.getFields(value)} );
                  result.push(</Accordion.Accordion>);
              }
              else {
                  // Plain field
                  result.push(
                      <div>
                          <strong> {field}: </strong> <Input transparent type = 'text' value = {value} > <input size = {value.toString().length} /> </Input>
                      </div>
                  );
              }
        }

        return result;
    }

    render() {
        const { docs } = this.props;



        const docsList = docs.map((doc, docIndex) => (
            <div>
                <Accordion>
                    <Accordion.Title> {docIndex} </Accordion.Title>
                    <Accordion.Content> { this.getFields(doc) } </Accordion.Content>
                </Accordion>
            </div>
        ));

        return (
            <div className="DataViewer">
                { docsList }
            </div>
        );
    }
}

export default DataViewer;

// docs.map((doc, docIndex) => (
//     <div>
//         {
//             Object.keys(doc).map((field, fieldIndex) => (
//                 <div>
//                 {
//                     doc[field] && doc[field].length ? <div> Array </div> : <div> field: doc[field] </div>
//                 }
//                 </div>
//             ))
//         }
//     </div>
// ));
