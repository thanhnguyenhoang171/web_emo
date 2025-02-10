import {
    Breadcrumb,
    Col,
    ConfigProvider,
    Divider,
    Form,
    Row,
    message,
    notification,
    Upload,
    Modal
} from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DebounceSelect } from "../user/debouce.select";
import {
    FooterToolbar,
    ProForm,
    ProFormDatePicker,
    ProFormDigit,
    ProFormSelect,
    ProFormSwitch,
    ProFormText,
} from "@ant-design/pro-components";
import styles from "styles/admin.module.scss";
import { LOCATION_LIST, SKILLS_LIST } from "@/config/utils";
import { ITypeSelect } from "../user/modal.user";
import { useState, useEffect } from "react";
import {
    callCreateProduct,
    callFetchType,
    callFetchProductById,
    callUpdateProduct,
    callUploadSingleFile,
} from "@/config/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CheckSquareOutlined } from "@ant-design/icons";
import enUS from "antd/lib/locale/en_US";
import { v4 as uuidv4 } from "uuid";
import { IProduct } from "@/types/backend";
import {
    LoadingOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi"; // Import tiếng Việt

dayjs.extend(relativeTime);
dayjs.locale("vi"); // Đặt locale về tiếng Việt

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IProduct | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

interface IProductForm {
    name: string;
}

interface IProductLogo {
    name: string;
    uid: string;
}

const ViewUpsertProduct = (props: any) => {
      const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } =
          props;
    const [types, setTypes] = useState<ITypeSelect[]>([]);
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const navigate = useNavigate();

    const [value, setValue] = useState<string>("");
    const [dataLogo, setDataLogo] = useState<IProductLogo[]>([]);
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // product id
    const [dataUpdate, setDataUpdate] = useState<IProduct | null>(null);
    const [form] = Form.useForm();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");

    useEffect(() => {
        const init = async () => {
            if (id) {
                const res = await callFetchProductById(id);
                if (res && res.data) {
                    setDataUpdate(res.data);
                    setValue(res.data.description);
                    setTypes([
                        {
                            label: res.data.type?.name as string,
                            value: `${res.data.type?._id}@#$${res.data.type?.logo}` as string,
                            key: res.data.type?._id,
                        },
                    ]);

                    form.setFieldsValue({
                        ...res.data,
                        type: {
                            label: res.data.type?.name as string,
                            value: `${res.data.type?._id}@#$${res.data.type?.logo}` as string,
                            key: res.data.type?._id,
                        },
                    });
                    
                }

                 
                    
                
            }
        };
        init();
        return () => form.resetFields();
    }, [id]);

    // Usage of DebounceSelect
    async function fetchTypeList(name: string): Promise<ITypeSelect[]> {
        const res = await callFetchType(
            `current=1&pageSize=100&name=/${name}/i`
        );
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map((item) => {
                return {
                    label: item.name as string,
                    value: `${item._id}@#$${item.logo}` as string,
                };
            });
            return temp;
        } else return [];
    }

    const onFinish = async (values: any) => {
        if (dataLogo.length === 0) {
            message.error("Vui lòng upload ảnh Feedback");
            return;
        }

        if (dataUpdate?._id) {
            //update
            const cp = values?.type?.value?.split("@#$");
            const product = {
                name: values.name,
                type: {
                    _id: cp && cp.length > 0 ? cp[0] : "",
                    name: values.type.label,
                    logo: cp && cp.length > 1 ? cp[1] : "",
                },
                isActive: values.isActive,
                price: values.price,
                image: dataLogo[0].name,
                description: value,
            };

            const res = await callUpdateProduct(
                dataUpdate._id,
                product.name,
                product.description,
                product.type,
                product.image,
                product.isActive
            );
            if (res.data) {
                message.success("Cập nhật sản phẩm thành công");
                navigate("/admin/product");
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res.message,
                });
            }
        } else {
            //create
            const cp = values?.type?.value?.split("@#$");
            const product = {
                name: values.name,
                type: {
                    _id: cp && cp.length > 0 ? cp[0] : "",
                    name: values.type.label,
                    logo: cp && cp.length > 1 ? cp[1] : "",
                },
                isActive: values.isActive,
                price: values.price,
                image: dataLogo[0].name,
                description: value,
            };

            const res = await callCreateProduct(product);
            if (res.data) {
                message.success("Tạo mới sản phẩm thành công");
                navigate("/admin/product");
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res.message,
                });
            }
        }
    };
    const handleUploadFileLogo = async ({ file, onSuccess, onError }: any) => {
        const res = await callUploadSingleFile(file, "product");
        if (res && res.data) {
            setDataLogo([
                {
                    name: res.data.fileName,
                    uid: uuidv4(),
                },
            ]);
            if (onSuccess) onSuccess("ok");
        } else {
            if (onError) {
                setDataLogo([]);
                const error = new Error(res.message);
                onError({ event: error });
            }
        }
    };
    const beforeUpload = (file: any) => {
        const isJpgOrPng =
            file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Image must smaller than 2MB!");
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info: any) => {
        if (info.file.status === "uploading") {
            setLoadingUpload(true);
        }
        if (info.file.status === "done") {
            setLoadingUpload(false);
        }
        if (info.file.status === "error") {
            setLoadingUpload(false);
            message.error(
                info?.file?.error?.event?.message ??
                    "Đã có lỗi xảy ra khi upload file."
            );
        }
    };
    const handleRemoveFile = (file: any) => {
        setDataLogo([]);
     
    };
    const handlePreview = async (file: any) => {
        if (!file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(
                file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
            );
            return;
        }
        getBase64(file.originFileObj, (url: string) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(
                file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
            );
        });
    };
    const getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    return (
        <div className={styles["upsert-product-container"]}>
            <div className={styles["title"]}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: (
                                <Link to="/admin/product">
                                    Quản lý sản phẩm
                                </Link>
                            ),
                        },
                        {
                            title: "Thêm & Cập Nhập",
                        },
                    ]}
                />
            </div>
            <div>
                <ConfigProvider locale={enUS}>
                    <ProForm
                        form={form}
                        onFinish={onFinish}
                        submitter={{
                            searchConfig: {
                                resetText: "Hủy",
                                submitText: (
                                    <>
                                        {dataUpdate?._id
                                            ? "Cập nhật Sản phẩm"
                                            : "Tạo mới Sản phẩm"}
                                    </>
                                ),
                            },
                            onReset: () => navigate("/admin/product"),
                            render: (_: any, dom: any) => (
                                <FooterToolbar>{dom}</FooterToolbar>
                            ),
                            submitButtonProps: {
                                icon: <CheckSquareOutlined />,
                            },
                        }}
                    >
                        <Row gutter={[20, 20]}>
                            <Col span={24} md={12}>
                                <ProFormText
                                    label="Tên Sản phẩm"
                                    name="name"
                                    rules={[
                                        {
                                            required: false,
                                            message: "Vui lòng không bỏ trống",
                                        },
                                    ]}
                                    placeholder="Nhập tên sản phẩm"
                                />
                            </Col>

                            <Col span={24} md={6}>
                                <ProFormDigit
                                    label="Giá cả"
                                    name="price"
                                    rules={[
                                        {
                                            required: false,
                                            message: "Vui lòng không bỏ trống",
                                        },
                                    ]}
                                    placeholder="Nhập giá"
                                    fieldProps={{
                                        addonAfter: " đ",
                                        formatter: (value) =>
                                            `${value}`.replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ","
                                            ),
                                        parser: (value) =>
                                            +(value || "").replace(
                                                /\$\s?|(,*)/g,
                                                ""
                                            ),
                                    }}
                                />
                            </Col>

                            {(dataUpdate?._id || !id) && (
                                <Col span={24} md={6}>
                                    <ProForm.Item
                                        name="type"
                                        label="Thuộc loại sản phẩm"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng chọn loại sản phẩm!",
                                            },
                                        ]}
                                    >
                                        <DebounceSelect
                                            allowClear
                                            showSearch
                                            defaultValue={types}
                                            value={types}
                                            placeholder="Chọn loại sản phẩm"
                                            fetchOptions={fetchTypeList}
                                            onChange={(newValue: any) => {
                                                if (
                                                    newValue?.length === 0 ||
                                                    newValue?.length === 1
                                                ) {
                                                    setTypes(
                                                        newValue as ITypeSelect[]
                                                    );
                                                }
                                            }}
                                            style={{ width: "100%" }}
                                        />
                                    </ProForm.Item>
                                </Col>
                            )}
                        </Row>

                        <Row>
                            <Col span={24} md={6}>
                                <ProFormSwitch
                                    label="Trạng thái"
                                    name="isActive"
                                    checkedChildren="ACTIVE"
                                    unCheckedChildren="INACTIVE"
                                    initialValue={true}
                                    fieldProps={{
                                        defaultChecked: true,
                                    }}
                                />
                            </Col>

                            {/* Upload file */}
                            <Col span={8}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Ảnh feedback"
                                    name="logo"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng không bỏ trống",
                                            validator: () => {
                                                if (dataLogo.length > 0)
                                                    return Promise.resolve();
                                                else
                                                    return Promise.reject(
                                                        false
                                                    );
                                            },
                                        },
                                    ]}
                                >
                                    <ConfigProvider locale={enUS}>
                                        <Upload
                                            name="logo"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            maxCount={1}
                                            multiple={false}
                                       
                                            customRequest={handleUploadFileLogo}
                                            beforeUpload={beforeUpload}
                                            onChange={handleChange}
                                            onRemove={(file) =>
                                                handleRemoveFile(file)
                                            }
                                            onPreview={handlePreview}
                                    
                                            defaultFileList={
                                        
                                                dataUpdate?._id
                                                    ? [
                                                          {
                                                              uid: uuidv4(),
                                                              name:
                                                                  dataUpdate?.image ??
                                                                  "",
                                                              status: "done",
                                                              url: `${
                                                                  import.meta
                                                                      .env
                                                                      .VITE_BACKEND_URL
                                                              }/images/product/${
                                                                  dataUpdate?.image
                                                              }`,
                                                          },
                                                      ]
                                                    : []
                                            }
                                        >
                                            <div>
                                                {loadingUpload ? (
                                                    <LoadingOutlined />
                                                ) : (
                                                    <PlusOutlined />
                                                )}
                                                <div style={{ marginTop: 8 }}>
                                                    Upload
                                                </div>
                                            </div>
                                        </Upload>
                                    </ConfigProvider>
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <ProForm.Item
                                    name="description"
                                    label="Miêu tả sản phẩm"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Vui lòng nhập miêu tả sản phẩm!",
                                        },
                                    ]}
                                >
                                    <ReactQuill
                                        theme="snow"
                                        value={value}
                                        onChange={setValue}
                                    />
                                </ProForm.Item>
                            </Col>
                        </Row>
                        <Divider />
                        <Modal
                            open={previewOpen}
                            title={previewTitle}
                            footer={null}
                            onCancel={() => setPreviewOpen(false)}
                            style={{ zIndex: 1500 }}
                        >
                            <img
                                alt="example"
                                style={{ width: "100%" }}
                                src={previewImage}
                            />
                        </Modal>
                    </ProForm>
                </ConfigProvider>
            </div>
        </div>
    );
};

export default ViewUpsertProduct;
