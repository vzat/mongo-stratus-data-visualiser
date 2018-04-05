import React, { Component } from 'react';
import classNames from 'classnames';

import { Input, Accordion, TextArea, Container, Segment, Sidebar, Menu, Button, Message, Icon } from 'semantic-ui-react'

class DataViewer extends Component {
    state = {
        docs: [],
        sidebar: [],
        docLoading: [],
        docError: [],
        modifiedDocs: [],
        selectedDoc: undefined
    };

    getDocs = (propDocs) => {
        let docs = [];
        let sidebar = [];
        let docLoading = [];
        let docError = [];
        let modifiedDocs = [];
        for (const propDocNo in propDocs) {
            docs.push(JSON.stringify(propDocs[propDocNo], null, 4));
            sidebar.push(false);
            docLoading.push(false);
            docError.push('');
            modifiedDocs.push(false);
        }
        this.setState({docs});
        this.setState({sidebar});
        this.setState({docLoading});
        this.setState({docError});
        this.setState({modifiedDocs});
        this.setState({selectedDoc: undefined});
    };

    componentDidMount = () => {
          this.getDocs(this.props.docs);
    };

    componentWillReceiveProps = (nextProps) => {
          if (this.props.docs !== nextProps.docs) {
                this.getDocs(nextProps.docs);
          }
    }

    changeDoc = async (event, comp) => {
        let { docs } = this.state;
        let { modifiedDocs } = this.state;
        // let { sidebar } = this.state;

        const docIndex = comp.docid;
        if (docIndex >= 0 && docIndex < docs.length) {
            docs[docIndex] = comp.value;
            modifiedDocs[docIndex] = true;
            // sidebar[docIndex] = true;
        }

        this.setState({docs});
        this.setState({modifiedDocs});
        // this.setState({sidebar});
    };

    saveDoc = async (event, comp) => {
        try {
            const { docs } = this.state;
            let { docLoading } = this.state;

            const docIndex = comp.docid;
            if (docIndex >= 0 && docIndex < docs.length) {
                const json = docs[docIndex];

                const doc = await JSON.parse(json);

                // Show the doc is loading
                docLoading[docIndex] = true;
                this.setState({docLoading});

                await this.props.setDoc(doc, docIndex);

                // Stop loading, hide sidebar, and hide error
                let { sidebar } = this.state;
                let { docError } = this.state;
                let { modifiedDocs } = this.state;

                sidebar[docIndex] = false;
                docError[docIndex] = '';
                docLoading[docIndex] = false;
                modifiedDocs[docIndex] = false;

                this.setState({sidebar});
                this.setState({docLoading});
                this.setState({docError});
                this.setState({modifiedDocs});
                this.setState({selectedDoc: undefined});
            }
        }
        catch (err) {
            const errString = err.toString();
            let { docError } = this.state;
            docError[comp.docid] = errString;
            this.setState({docError});

            const positionIndex = errString.indexOf('position');
            if (positionIndex !== -1 && positionIndex + 9 < errString.length) {
                const numberString = errString.substr(positionIndex + 9);
                if (numberString.length > 0) {
                    const number = parseInt(numberString);
                    this.refs['textarea-' + comp.docid].focus();
                    this.refs['textarea-' + comp.docid].ref.selectionStart = number;
                    this.refs['textarea-' + comp.docid].ref.selectionEnd = number;
                }
            }
        }
    };

    revertDoc = async (event, comp) => {
        let { docs } = this.state;
        let { sidebar } = this.state;
        let { docError } = this.state;
        let { modifiedDocs } = this.state;
        const propDocs = this.props.docs;

        const docIndex = comp.docid;
        if (docIndex >= 0 && docIndex < docs.length) {
            if (docIndex < propDocs.length) {
                docs[docIndex] = JSON.stringify(propDocs[docIndex], null, 4);
                modifiedDocs[docIndex] = false;
                this.setState({modifiedDocs});
            }
            else {
                docs[docIndex] = JSON.stringify({}, null, 4);
            }
            // sidebar[docIndex] = false;
            docError[docIndex] = '';

            this.setState({docs});
            // this.setState({sidebar});
            this.setState({docError});

            // this.setState({selectedDoc: undefined});
        }
    };

    showSidebar = (docIndex) => {
        let { sidebar } = this.state
        if (docIndex >= 0 && docIndex < sidebar.length) {
            for (let sidebarNo = 0 ; sidebarNo < sidebar.length ; sidebarNo ++) {
                sidebar[sidebarNo] = false;
            }
            sidebar[docIndex] = true;
            this.setState({sidebar});
            this.setState({selectedDoc: docIndex});
        }
    };

    hideSidebar = (docIndex) => {
        let { sidebar } = this.state
        if (docIndex >= 0 && docIndex < sidebar.length) {
            sidebar[docIndex] = false;
            this.setState({sidebar});
            this.setState({selectedDoc: undefined});
        }
    };

    addDocument = () => {
       let { state } = this;
       state.docs.push(JSON.stringify({}, null, 4));
       state.sidebar.push(false);
       state.docLoading.push(false);
       state.docError.push('');
       state.modifiedDocs.push(true);

       this.setState(state);
    };

    render() {
        const { docs } = this.state;

        const textAreaClasses = docs.map((doc, docIndex) => {
            return classNames({
                'doc-textarea': true,
                'doc-textarea-default': this.state.selectedDoc !== docIndex,
                'doc-textarea-selected': this.state.selectedDoc === docIndex,
                'doc-textarea-modified': this.state.modifiedDocs[docIndex],
                'doc-textarea-error': this.state.docError[docIndex]
            });
        });

        const segmentClasses = docs.map((doc, docIndex) => {
            return classNames({
                'doc-segment': true,
                'doc-segment-default': this.state.selectedDoc !== docIndex,
                'doc-segment-selected': this.state.selectedDoc === docIndex
            })
        });

        const docsList = docs.map((doc, docIndex) => (
            <Sidebar.Pushable as = {Segment}>
                <Sidebar as = {Menu}
                    animation = 'overlay'
                    width = 'thin'
                    direction = 'right'
                    visible = {this.state.sidebar[docIndex]}
                    vertical
                    borderless >
                        <Menu.Item>
                            <Button fluid icon
                                labelPosition = 'left'
                                disabled = {!this.state.modifiedDocs[docIndex]}
                                docid = {docIndex}
                                color = 'green'
                                onClick = {this.saveDoc}>
                                    <Icon name = 'save' />
                                    Save
                            </Button>
                        </Menu.Item>
                        <Menu.Item>
                            <Button fluid icon
                                labelPosition = 'left'
                                disabled = {!this.state.modifiedDocs[docIndex]}
                                docid = {docIndex}
                                color = 'yellow'
                                onClick = {this.revertDoc}>
                                    <Icon name = 'repeat' />
                                     Revert
                            </Button>
                        </Menu.Item>
                        <Menu.Item>
                            <Button fluid icon
                                labelPosition = 'left'
                                docid = {docIndex}
                                color = 'red'
                                onClick = {this.removeDoc}>
                                    <Icon name = 'trash' />
                                    Delete
                            </Button>
                        </Menu.Item>
                        <Menu.Item>
                            <Button fluid icon
                                labelPosition = 'left'
                                docid = {docIndex}
                                onClick = {() => {this.hideSidebar(docIndex)}}>
                                    <Icon name = 'hide' />
                                    Hide
                            </Button>
                        </Menu.Item>

                </Sidebar>
                <Sidebar.Pusher>
                    <Segment fluid loading = {this.state.docLoading[docIndex]} className = {segmentClasses[docIndex]}>
                        <TextArea autoHeight
                            ref = {'textarea-' + docIndex}
                            docid = {docIndex}
                            className = {textAreaClasses[docIndex]}
                            spellcheck = 'false'
                            value = {this.state.docs[docIndex]}
                            onChange = {this.changeDoc}
                            onFocus = {() => {this.showSidebar(docIndex)}}
                        />
                        {
                            this.state.docError[docIndex] &&
                            <Menu.Item>
                                <Message negative size = 'small' className = 'error-message'>
                                    { this.state.docError[docIndex] }
                                </Message>
                            </Menu.Item>
                        }
                    </Segment>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        ));

        return (
            <div className="DataViewer">
                <Segment.Group>
                    { docsList }
                </Segment.Group>
                <Button fluid basic
                    color = 'green'
                    icon = 'plus'
                    onClick = {() => this.addDocument()}
                />
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
