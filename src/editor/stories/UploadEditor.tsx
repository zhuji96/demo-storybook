/* tslint:disable:no-console */
import * as React from 'react';
import * as qiniu from 'qiniu-js';
import * as PropTypes from 'prop-types';
import { get } from 'lodash';
import { Progress, message } from 'antd';

import Editor from '../Editor';
import Portal from '../../portal/index';

import {
    getUploadToken,
    IUploadResponse,
    IUploadProcessComplete,
    IUploadProcessNext,
    IUploadProcessError,
} from './server/upload';

type EventHandler<A> = (a: A, ...rest: any[]) => any;
interface IFile {
    lastModified: string;
    type: string;
    name: string;
    size: string;
}
type TUploadFile = IFile | File | Blob;

interface IUploadEditorProps {
    apiKey?: string;
    domain: string;
    mediaAccept?: string;
    imageAccept?: string;
    onComplete?: EventHandler<IUploadProcessComplete & { file: TUploadFile | null }>;
    onError?: EventHandler<IUploadProcessError & { file: TUploadFile | null }>;
    onProgress?: EventHandler<IUploadProcessNext & { file: TUploadFile | null }>;
}

interface IUploadEditorState {
    loading: boolean;
    progress: string;
}

interface IMeta {
    filetype: string;
}

const progressContainStyles: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.5)',
    zIndex: 999,
};

function UploadProgress({ progress = 0, ...rest }) {
    return (
        <div style={progressContainStyles}>
            <Progress type="circle" percent={progress} {...rest} />
        </div>
    );
}

export default class UploadEditor extends React.Component<IUploadEditorProps, IUploadEditorState> {
    public static propTypes = {
        apiKey: PropTypes.string,
        domain: PropTypes.string.isRequired,
        imageAccept: PropTypes.string,
        mediaAccept: PropTypes.string,
        onProgress: PropTypes.func,
        onComplete: PropTypes.func,
        onError: PropTypes.func,
    };

    public static defaultProps: Partial<IUploadEditorProps> = {
        mediaAccept: '*',
        imageAccept: '*',
        onProgress: (processInfo: IUploadProcessNext): void => {},
        onComplete: (processInfo: IUploadProcessComplete): void => {},
        onError: (processInfo: IUploadProcessError): void => {},
    };

    private file: TUploadFile | null;
    private subscription: any;

    constructor(props: IUploadEditorProps) {
        super(props);
        this.state = {
            loading: false,
            progress: '0',
        };
    }

    public render(): React.ReactNode {
        const { loading, progress } = this.state;
        return (
            <React.Fragment>
                <Editor
                    // tslint:disable-next-line: jsx-no-bind
                    onCloseWindow={this.cancelUpload.bind(this)}
                    init={{
                        plugins:
                            'print preview importcss searchreplace directionality code visualblocks fullscreen image link media codesample table charmap hr pagebreak anchor insertdatetime advlist lists textpattern emoticons',
                        menubar: 'file edit view insert format table',
                        toolbar:
                            'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap | fullscreen  preview print | image media link anchor codesample | ltr rtl',
                        height: 300,
                        image_advtab: true,
                        image_title: true,
                        media_alt_source: true,
                        media_dimensions: true,
                        file_picker_types: 'image media',
                        media_poster: true,
                        file_picker_callback: (cb: Function, value: string, meta: IMeta) => {
                            const accept = this.getAccept(meta);
                            const input = document.createElement('input');
                            input.setAttribute('type', 'file');
                            input.setAttribute('accept', accept);
                            input.onchange = async () => {
                                this.file = input && input.files && input.files[0];
                                const tokenInfo: IUploadResponse = await getUploadToken();
                                const key = undefined;
                                const putExtra = {
                                    fname: '',
                                    params: {},
                                };
                                const config = {
                                    useCdnDomain: true,
                                };
                                const observable = qiniu.upload(
                                    this.file as Blob,
                                    key,
                                    tokenInfo.uptoken,
                                    putExtra,
                                    config,
                                );
                                this.subscription = observable.subscribe(
                                    this.next.bind(this),
                                    this.error.bind(this),
                                    this.complete.bind(this, cb),
                                );
                                this.setState({ loading: true });
                            };
                            input.click();
                        },
                    }}
                />
                {loading && (
                    <Portal elementClassName="tox-dialog" visible={loading}>
                        <UploadProgress progress={+progress} />
                    </Portal>
                )}
            </React.Fragment>
        );
    }

    private getAccept(meta: IMeta) {
        const { mediaAccept = '*', imageAccept = '*' } = this.props;
        switch (meta.filetype) {
            case 'media':
                return mediaAccept;
            case 'image':
                return imageAccept;
            default:
                return '*';
        }
    }

    private next(processInfo: IUploadProcessNext) {
        const { onProgress } = this.props;
        if (onProgress) {
            onProgress({ ...processInfo, file: this.file });
        }
        const progress = get(processInfo, 'total.percent', '0').toFixed(0);
        this.setState({ progress });
    }

    private complete(cb: any, processInfo: IUploadProcessComplete) {
        if (get(processInfo, 'key')) {
            const { lastModified, type, name: title, size } = this.file as IFile;
            const { onComplete, domain } = this.props;
            const url = `${domain}${get(processInfo, 'hash')}`;
            cb(url, { lastModified, type, title, size });
            if (onComplete) {
                onComplete({ ...processInfo, file: this.file });
            }
            this.cancelUpload();
        }
    }

    private error(processInfo: IUploadProcessError) {
        message.error('上传失败！');
        const { onError } = this.props;
        if (onError) {
            onError({ ...processInfo, file: this.file });
        }
        this.cancelUpload();
    }

    private cancelUpload() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = null;
        this.file = null;
        this.setState({
            loading: false,
            progress: '0',
        });
    }
}
