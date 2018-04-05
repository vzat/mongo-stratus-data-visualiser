import React, { Component } from 'react';
import classNames from 'classnames';

import { Input, Accordion, TextArea, Container, Segment, Sidebar, Menu, Button, Message, Icon, Divider } from 'semantic-ui-react'

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
            docs.push(JSON.stringify(propDocs[propDocNo], null, '\t'));
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

        const docIndex = comp.docid;
        if (docIndex >= 0 && docIndex < docs.length) {
            docs[docIndex] = comp.value;
            modifiedDocs[docIndex] = true;
        }

        this.setState({docs});
        this.setState({modifiedDocs});
    };

    saveDoc = async (event, comp) => {
        try {
            const { docs } = this.state;
            let { docLoading } = this.state;

            const docIndex = comp.docid;
            if (docIndex >= 0 && docIndex < docs.length) {
                const json = docs[docIndex];

                const doc = await JSON.parse(json);
                console.log(doc);

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
                docs[docIndex] = JSON.stringify(propDocs[docIndex], null, '\t');
                modifiedDocs[docIndex] = false;
                this.setState({modifiedDocs});
            }
            else {
                docs[docIndex] = JSON.stringify({}, null, '\t');
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

    addDocument = async () => {
       await this.props.insertDocument({});

       if (this.props.docs) {
           await this.getDocs(this.props.docs);
       }
    };

    removeDocument = async (event, comp) => {
        let { docLoading } = this.state;
        docLoading[comp.docid] = true;
        this.setState({docLoading});

        await this.props.removeDocument(comp.docid);

        if (this.props.docs) {
            await this.getDocs(this.props.docs);
        }

        docLoading[comp.docid] = false;
        this.setState({docLoading});
    };

    // https://stackoverflow.com/questions/35888205/prevent-react-from-capturing-tab-character
    // Capture tab and insert it to the document
    handleKeyDown = (event, comp) => {
        if (event.key === 'Tab') {
            event.preventDefault();

            let { docs } = this.state;
            const { selectedDoc } = this.state;
            if (selectedDoc >= 0 && selectedDoc < docs.length) {
                const selectionStart = this.refs['textarea-' + selectedDoc].ref.selectionStart;
                const selectionEnd = this.refs['textarea-' + selectedDoc].ref.selectionEnd;

                // Add tab into textfield
                const doc = docs[selectedDoc];
                docs[selectedDoc] = doc.substring(0, selectionStart) + '\t' + doc.substring(selectionEnd);

                this.setState({docs}, () => {
                    // Change selection start and end after the state changed
                    this.refs['textarea-' + selectedDoc].ref.selectionStart = selectionStart + 1;
                    this.refs['textarea-' + selectedDoc].ref.selectionEnd = selectionStart + 1;
                });
            }
        }
        if (event.key === '{') {
            let { docs } = this.state;
            const { selectedDoc } = this.state;
            if (selectedDoc >= 0 && selectedDoc < docs.length) {
                const selectionStart = this.refs['textarea-' + selectedDoc].ref.selectionStart;
                const selectionEnd = this.refs['textarea-' + selectedDoc].ref.selectionEnd;

                const doc = docs[selectedDoc];
                docs[selectedDoc] = doc.substring(0, selectionStart) + '{}' + doc.substring(selectionEnd);

                this.setState({docs}, () => {
                    // Change selection start and end after the state changed
                    this.refs['textarea-' + selectedDoc].ref.selectionStart = selectionStart + 1;
                    this.refs['textarea-' + selectedDoc].ref.selectionEnd = selectionStart + 1;
                });

                event.preventDefault();
            }
        }
        if (event.key === '[') {
            let { docs } = this.state;
            const { selectedDoc } = this.state;
            if (selectedDoc >= 0 && selectedDoc < docs.length) {
                const selectionStart = this.refs['textarea-' + selectedDoc].ref.selectionStart;
                const selectionEnd = this.refs['textarea-' + selectedDoc].ref.selectionEnd;

                const doc = docs[selectedDoc];
                docs[selectedDoc] = doc.substring(0, selectionStart) + '[]' + doc.substring(selectionEnd);

                this.setState({docs}, () => {
                    // Change selection start and end after the state changed
                    this.refs['textarea-' + selectedDoc].ref.selectionStart = selectionStart + 1;
                    this.refs['textarea-' + selectedDoc].ref.selectionEnd = selectionStart + 1;
                });

                event.preventDefault();
            }
        }
        if (event.keyCode === 13) {
            let { docs } = this.state;
            const { selectedDoc } = this.state;
            if (selectedDoc >= 0 && selectedDoc < docs.length) {
                const selectionStart = this.refs['textarea-' + selectedDoc].ref.selectionStart;
                const selectionEnd = this.refs['textarea-' + selectedDoc].ref.selectionEnd;

                const doc = docs[selectedDoc];
                const firstPartDoc = doc.substring(0, selectionStart);
                const lines = firstPartDoc.split('\n');

                // Get number of tabs from previous line
                let noTabs = 0;
                if (lines.length > 0) {
                    const lastLine = lines[lines.length - 1];
                    let tabPos = lastLine.indexOf('\t');

                    while (tabPos !== -1 && tabPos + 1 < lastLine.length) {
                        noTabs ++;
                        tabPos = lastLine.indexOf('\t', tabPos + 1);
                    }
                }

                let tabString = '';
                for (let tabNo = 0 ; tabNo < noTabs ; tabNo ++) {
                    tabString += '\t';
                }

                let newLineString = '';
                if (selectionStart > 0 && selectionStart < doc.length) {
                    if ((doc.charAt(selectionStart - 1) === '{' && doc.charAt(selectionStart) === '}') ||
                        (doc.charAt(selectionStart - 1) === '[' && doc.charAt(selectionStart) === ']')) {
                            newLineString = '\n' + tabString;
                            noTabs ++;
                            tabString += '\t';
                    }
                }

                docs[selectedDoc] = doc.substring(0, selectionStart) + '\n' + tabString + newLineString + doc.substring(selectionEnd);

                this.setState({docs}, () => {
                    // Change selection start and end after the state changed
                    this.refs['textarea-' + selectedDoc].ref.selectionStart = selectionStart + noTabs + 1;
                    this.refs['textarea-' + selectedDoc].ref.selectionEnd = selectionStart + noTabs + 1;
                });

                event.preventDefault();
            }
        }
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
                                onClick = {this.removeDocument}>
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
                            onKeyDown = {this.handleKeyDown}
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
                { !this.props.fetchingDocs && this.state.docs.length === 0 &&
                    <Container style = {{textAlign: 'center'}}> <h3> No Documents </h3> <Divider hidden /> </Container>
                }

                { !this.props.fetchingDocs && this.state.docs.length > 0 &&
                    <Segment.Group>
                        { docsList }
                    </Segment.Group>
                }

                { !this.props.fetchingDocs &&
                    <Button fluid basic
                        color = 'green'
                        icon = 'plus'
                        onClick = {() => this.addDocument()}
                    />
                }

                { this.props.fetchingDocs &&
                    <div>
                        <Segment.Group>
                            <Segment secondary style = {{ minHeight: '200px' }}>
                                <Segment tertiary />
                                <Segment tertiary />
                                <Segment tertiary />
                            </Segment>
                        </Segment.Group>
                    </div>
                }

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
