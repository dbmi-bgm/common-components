import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { ajax } from './../../util';
import _ from 'underscore';

export class DragAndDropUploadSubmissionViewController extends React.Component {
    /* Will become a submission-view specific version of the standalone controller to wrap
    it and pass through the appropriate functions */
}


export class DragAndDropUploadStandaloneController extends React.Component {
    static propTypes = {
        fieldType: PropTypes.string.isRequired,
        fieldName: PropTypes.string, // If this isn't passed in, use fieldtype instead
        award: PropTypes.string, // Required for 4DN
        lab: PropTypes.string, // Required for 4DN
        institution: PropTypes.object, // Required for CGAP
        project: PropTypes.object, // Required for CGAP
        cls: PropTypes.string
    }

    static defaultProps = {
        // award: "/awards/1U01CA200059-01/", // for testing
        // lab: "/labs/4dn-dcic-lab", // for testing
        cls: "btn"
    }

    constructor(props) {
        super(props);
        this.state = {
            // TODO: Figure out exactly how granular we can get with upload state
        };

        this.onUploadStart = this.onUploadStart.bind(this);
    }
    // /* Will become a generic data controller for managing upload state */

    createItem(file) {
        const { fieldType, award, lab, institution, project } = this.props;

        const destination = `/${fieldType}/`; //?check_only=true`; // testing only

        const payloadObj = {};
        const aliasFilename = file.name.split(' ').join('');
        let alias;

        // If on 4DN, use lab and award data
        if (lab && award) {

            // Generate an alias for the file
            const aliasLab = lab.split('/')[2];
            alias = aliasLab + ":" + aliasFilename + Date.now();

            payloadObj.award = award;
            payloadObj.lab = lab;
            payloadObj.aliases = [alias];

        // on CGAP, use this data instead
        } else if (institution && project) {
            payloadObj.institution = institution['@id'];
            payloadObj.project = project['@id'];
        }

        // Build a payload with info to create metadata Item
        const payload = JSON.stringify([payloadObj, {}]);

        return ajax.promise(destination, 'POST', {}, payload).then((response) => {
            console.log("response", response);

            if (response.status && response.status !== 'success'){ // error
                console.log("ERROR");
            } else {
                // let responseData;
                // let submitted_at_id;
                // [ responseData ] = response['@graph'];
            //     submitted_at_id = object.itemUtil.atId(responseData);
            //     console.log("submittedAtid=",submitted_at_id);
            //     // here you would attach some onchange function from submission view
            }
        });
        //     if (response.status && response.status !== 'success'){ // error
        //         stateToSet.keyValid[inKey] = 2;
        //         if(!suppressWarnings){
        //             var errorList = response.errors || [response.detail] || [];
        //             // make an alert for each error description
        //             stateToSet.errorCount = errorList.length;
        //             for(i = 0; i<errorList.length; i++){
        //                 var detail = errorList[i].description || errorList[i] || "Unidentified error";
        //                 if (errorList[i].name){
        //                     detail += ('. ' + errorList[i].name + ' in ' + keyDisplay[inKey]);
        //                 } else {
        //                     detail += ('. See ' + keyDisplay[inKey]);
        //                 }
        //                 Alerts.queue({
        //                     'title' : "Validation error " + parseInt(i + 1),
        //                     'message': detail,
        //                     'style': 'danger'
        //                 });
        //             }
        //             setTimeout(layout.animateScrollTo(0), 100); // scroll to top
        //         }
        //         this.setState(stateToSet);
        //     } else { // response successful
        //         let responseData;
        //         let submitted_at_id;
        //         if (test){
        //             stateToSet.keyValid[inKey] = 3;
        //             this.setState(stateToSet);
        //             return;
        //         } else {
        //             [ responseData ] = response['@graph'];
        //             submitted_at_id = object.itemUtil.atId(responseData);
        //             console.log("submittedAtid=",submitted_at_id);
        //         }
        //         // handle submission for round two
        //         if (roundTwo){
        //             // there is a file
        //             if (file && responseData.upload_credentials){

        //                 // add important info to result from finalizedContext
        //                 // that is not added from /types/file.py get_upload
        //                 const creds = responseData.upload_credentials;

        //                 import(
        //                     /* webpackChunkName: "aws-utils" */
        //                     /* webpackMode: "lazy" */
        //                     '../util/aws'
        //                 ).then(({ s3UploadFile })=>{
        //                     //const awsUtil = require('../util/aws');
        //                     const upload_manager = s3UploadFile(file, creds);

        //                     if (upload_manager === null){
        //                         // bad upload manager. Cause an alert
        //                         alert("Something went wrong initializing the upload. Please contact the 4DN-DCIC team.");
        //                     } else {
        //                         // this will set off a chain of aync events.
        //                         // first, md5 will be calculated and then the
        //                         // file will be uploaded to s3. If all of this
        //                         // is succesful, call finishRoundTwo.
        //                         stateToSet.uploadStatus = null;
        //                         this.setState(stateToSet);
        //                         this.updateUpload(upload_manager);
        //                     }
        //                 });

        //             } else {
        //                 // state cleanup for this key
        //                 // this.finishRoundTwo();
        //                 this.setState(stateToSet);
        //             }
        //     }
        // }
    }

    onUploadStart(files) {
        console.log("Attempting to start upload with files... ", files);
        const promises = [];

        files.forEach((file) => {
            promises.push(this.createItem(file));
        });

        console.log(promises);
    }

    render() {
        const { cls, fieldName, fieldType } = this.props;

        return <DragAndDropUploadButton {...{ cls, fieldName, fieldType }}
            onUploadStart={this.onUploadStart} />;
    }
}

class DragAndDropUploadButton extends React.Component {
    static propTypes = {
        onUploadStart: PropTypes.func.isRequired,     // Actions to take upon upload; exact status of upload controlled by data controller wrapper
        fieldType: PropTypes.string,                  // Schema-formatted type (Ex. Item, Document, etc)
        fieldName: PropTypes.string,                  // Name of specific field (Ex. Related Documents)
        multiselect: PropTypes.bool,
        cls: PropTypes.string
    }

    static defaultProps = {
        // TODO: Double check that these assumptions make sense...
        fieldType: "Document",
        multiselect: false
    }

    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };

        this.onHide = this.onHide.bind(this);
        this.onShow = this.onShow.bind(this);
    }

    onHide() {
        const { showModal } = this.state;
        if (showModal) {
            this.setState({ showModal: false });
        }
    }

    onShow() {
        const { showModal } = this.state;
        if (!showModal) {
            this.setState({ showModal: true });
        }
    }

    render() {
        const { showModal: show, multiselect } = this.state;
        const { onUploadStart, fieldType, cls, fieldName } = this.props;

        return (
            <div>
                <DragAndDropFileUploadModal onHide={this.onHide}
                    {...{ multiselect, show, onUploadStart, fieldType, fieldName }}
                />
                <button type="button" onClick={this.onShow} className={cls}><i className="icon icon-upload fas"></i> Quick Upload a new {fieldType}</button>
            </div>
        );
    }
}

class DragAndDropFileUploadModal extends React.Component {
    /*
        Drag and Drop File Manager Component that accepts an onHide and onContainerKeyDown function
        Functions for hiding, and handles files.
    */
    static propTypes = {
        onHide: PropTypes.func.isRequired,              // Should control show state/prop below
        onUploadStart: PropTypes.func.isRequired,       // Should trigger the creation of a new object, and start upload
        show: PropTypes.bool,                           // Controlled by state method onHide passed in as prop
        multiselect: PropTypes.bool,                    // Passed in from Schema, along with field and item types
        fieldType: PropTypes.string,
        fieldName: PropTypes.string
    }

    static defaultProps = {
        show: true,
        multiselect: true
    }

    constructor(props){
        super(props);
        this.state = {
            files: [] // Always in an array, even if multiselect enabled
        };

        this.handleAddFile = this.handleAddFile.bind(this);
        this.handleRemoveFile = this.handleRemoveFile.bind(this);
        this.handleClearAllFiles = this.handleClearAllFiles.bind(this);
        this.handleHideModal = this.handleHideModal.bind(this);
    }

    handleAddFile(evt) {
        const { items, files } = evt.dataTransfer;
        const { multiselect } = this.props;
        const { files: currFiles } = this.state;

        if (items && items.length > 0) {
            if (multiselect) {
                // Add all dragged items
                const fileArr = [];

                // Populate an array with all of the new files
                for (var i = 0; i < files.length; i++) {
                    console.log(files[i]);
                    fileArr.push(files[i]);
                }

                // Concat with current array
                const allFiles = currFiles.concat(fileArr);

                // Filter out duplicates (based on just filename for now; may need more criteria in future)
                const dedupedFiles = _.uniq(allFiles, false, (file) => file.name);

                this.setState({
                    files: dedupedFiles
                });
            } else {
                // Select only one file at a time
                this.setState({
                    files: [files[0]]
                });
            }
        }
    }

    handleRemoveFile(id) {
        const { files } = this.state;
        const { 0: name, 1: size, 2: lastModified } = id.split("|");

        // Filter to remove the clicked file by ID parts
        const newFiles = files.filter((file) => {
            if ((file.name === name) &&
                (file.size === parseInt(size)) &&
                (file.lastModified === parseInt(lastModified))
            ) {
                return false;
            }
            return true;
        });

        this.setState({ files: newFiles });
    }

    handleClearAllFiles() {
        this.setState({ files: [] });
    }

    handleHideModal() {
        // Force to clear files before hiding modal, so each time it is opened
        // anew, user doesn't have to re-clear it.
        const { onHide: propsOnHideFxn } = this.props;

        this.handleClearAllFiles();
        propsOnHideFxn();
    }

    render(){
        const {
            show, onUploadStart, fieldType, fieldName
        } = this.props;
        const { files } = this.state;

        let showFieldName = fieldName && fieldType !== fieldName;

        return (
            <Modal centered {...{ show }} onHide={this.handleHideModal} className="submission-view-modal">
                <Modal.Header closeButton>
                    <Modal.Title className="text-500">
                        Upload a {fieldType} { showFieldName ? "for " + fieldName : null}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DragAndDropZone {...{ files }}
                        handleAddFile={this.handleAddFile}
                        handleRemoveFile={this.handleRemoveFile} />
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-danger" onClick={this.handleHideModal}>
                        <i className="icon fas icon-close"></i> Cancel
                    </button>
                    {/* TODO: Controlled file inputs are complicated... maybe wait to implement this
                    // Refer to https://medium.com/trabe/controlled-file-input-components-in-react-3f0d42f901b8
                    <input type="files" name="filesFromBrowse[]" className="btn btn-primary">
                        <i className="icon fas icon-folder-open"></i> Browse
                    </input> */}
                    <button type="button" className="btn btn-primary" onClick={() => onUploadStart(files)}
                        disabled={files.length === 0}>
                        <i className="icon fas icon-upload"></i> Upload {fieldName}
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export class DragAndDropZone extends React.Component {
    static propTypes = {
        /** Callback called when Item is received. Should accept @ID and Item context (not guaranteed) as params. */
        'handleAddFile'          : PropTypes.func.isRequired,
        'handleRemoveFile'       : PropTypes.func.isRequired,
        'files'                  : PropTypes.array
    };

    static defaultProps = {
        'files'             : []
    };

    constructor(props){
        super(props);
        this.state = {
            dragging: false
        };
        this.dropZoneRef = React.createRef();
        this.cleanUpEventListeners = this.cleanUpEventListeners.bind(this);
        this.setUpEventListeners = this.setUpEventListeners.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }

    componentDidMount() {
        this.setUpEventListeners();
    }

    componentWillUnmount() {
        this.cleanUpEventListeners();
    }

    setUpEventListeners() {
        const div = this.dropZoneRef.current;
        div.addEventListener('dragenter', this.handleDragIn);
        div.addEventListener('dragleave', this.handleDragOut);
        div.addEventListener('dragover', this.handleDrag);
        div.addEventListener('drop', this.handleDrop);
    }

    cleanUpEventListeners() {
        const div = this.dropZoneRef.current;
        div.removeEventListener('dragenter', this.handleDragIn);
        div.removeEventListener('dragleave', this.handleDragOut);
        div.removeEventListener('dragover', this.handleDrag);
        div.removeEventListener('drop', this.handleDrop);
    }

    handleDrag(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }

    handleDragIn(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }

    handleDragOut(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }

    // TODO: Consider making handlers props for even more modularity
    handleDrop(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        // Add dropped files to the file manager
        const { handleAddFile } = this.props;
        handleAddFile(evt);
    }

    render() {
        const { files, handleRemoveFile } = this.props;

        return (
            <div
                className="panel text-center"
                style={{
                    backgroundColor: '#eee',
                    border: "1px solid #efefef",
                    height: "30vh",
                    flexDirection: "row",
                    display: "flex",
                    /*overflowY: "auto",*/
                    overflowX: "hidden",
                    justifyContent: "center"
                }}
                ref={this.dropZoneRef}
            >
                <span style={{ alignSelf: "center" }}>
                    { files.length === 0 ? "Drag a file here to upload" : null }
                </span>
                {/* TODO: Consider making the file list a separate component...
                think about potential future features like listing files without icons/in rows
                or even sorting... would be best to have this be separate if implementing those */}
                <ul style={{
                    listStyleType: "none",
                    display: "flex",
                    margin: "0",
                    paddingTop: "10px",
                    paddingLeft: "0",
                    flexWrap: "wrap",
                    justifyContent: "center"
                }}>
                    { files.map(
                        (file) => {
                            const fileId = `${file.name}|${file.size}|${file.lastModified}`;

                            return (
                                <li key={fileId} className="m-1">
                                    <FileIcon fileName={file.name} fileSize={file.size}
                                        fileType={file.type} fileId={fileId} {...{ handleRemoveFile }} />
                                </li>
                            );
                        }
                    )}
                </ul>
            </div>
        );
    }
}

function FileIcon(props) {
    const { fileType, fileName, fileSize, fileId, handleRemoveFile } = props;

    function getFileIconClass(mimetype){
        if (mimetype.match('^image/')) {
            return 'file-image';
        } else if (mimetype.match('^text/html')) {
            return 'file-code';
        } else if (mimetype.match('^text/plain')) {
            return 'file-alt';
        } else {
            return 'file';
        }
    }

    return (
        <div style={{ flexDirection: "column", width: "150px", display: "flex" }}>
            <i onClick={() => handleRemoveFile(fileId)} className="icon fas icon-window-close text-danger"></i>
            <i className={`icon far icon-2x icon-${getFileIconClass(fileType)}`} style={{ marginBottom: "5px", color: "#444444" }}></i>
            <span style={{ fontSize: "12px" }}>{fileName}</span>
            <span style={{ fontSize: "10px" }}>{fileSize} bytes</span>
        </div>
    );
}