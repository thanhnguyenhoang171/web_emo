import { useAppSelector } from "@/redux/hooks";
import { IProduct, IRating } from "@/types/backend";
import { ProCard, ProForm } from "@ant-design/pro-components";
import {
    Button,
    Col,
    ConfigProvider,
    Divider,
    Modal,
    Row,
    Upload,
    message,
    notification,
} from "antd";
import { useNavigate } from "react-router-dom";
import enUS from "antd/lib/locale/en_US";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { callCreateRating, callUploadSingleFileFeedback } from "@/config/api";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
    productDetail: IProduct | null;
    dataInit?: IRating | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

const ApplyModal = (props: IProps) => {
    const { isModalOpen, setIsModalOpen, productDetail, reloadTable } = props;

    const isAuthenticated = useAppSelector(
        (state) => state.account.isAuthenticated
    );
    const user = useAppSelector((state) => state.account.user);
    const [urlImage, setUrlImage] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [detectedEmotions, setDetectedEmotions] = useState<
        IRating["detectedEmotion"]
    >([]);
    const [loading, setLoading] = useState<boolean>(false); // Thêm state loading

    const navigate = useNavigate();

    const handleOkButton = async () => {
        if (!urlImage && isAuthenticated) {
            message.error("Vui lòng upload hình ảnh feedback!");
            return;
        }

        if (!isAuthenticated) {
            setIsModalOpen(false);
            navigate(`/login?callback=${window.location.href}`);
        } else {
            if (productDetail) {
                setLoading(true); // Bật loading khi bắt đầu đánh giá
                try {
                    const res = await callCreateRating(
                        urlImage,
                        productDetail?.type?._id,
                        productDetail?._id,
                        comment,
                        detectedEmotions || []
                    );

                    if (res.data) {
                        message.success(
                            "Upload sản phẩm đánh giá thành công! Xin cảm ơn quý khách"
                        );
                        setIsModalOpen(false);
                        reloadTable();
                        setComment("");
                        setDetectedEmotions([]);
                    } else {
                        notification.error({
                            message: "Có lỗi xảy ra",
                            description: res.message,
                        });
                    }
                } catch (error) {
                    message.error("Đã có lỗi xảy ra, vui lòng thử lại!");
                } finally {
                    setLoading(false); // Tắt loading khi hoàn tất
                }
            }
        }
    };

    const propsUpload: UploadProps = {
        maxCount: 1,
        multiple: false,
        accept: "image/jpeg,image/png,image/gif,image/bmp,image/webp",
        async customRequest({ file, onSuccess, onError }: any) {
            const res = await callUploadSingleFileFeedback(file, "rating");
            if (res && res.data) {
                setUrlImage(res.data.fileName);
                setDetectedEmotions(res.data.detectedEmotion);
                if (onSuccess) onSuccess("ok");
            } else {
                if (onError) {
                    setUrlImage("");
                    setDetectedEmotions([]);
                    const error = new Error(res.message);
                    onError({ event: error });
                }
            }
        },
        onChange(info) {
            if (info.file.status === "done") {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === "error") {
                message.error(
                    info?.file?.error?.event?.message ??
                        "Đã có lỗi xảy ra khi upload file."
                );
            }
        },
    };

    return (
        <Modal
            title="Đánh giá sản phẩm & dịch vụ"
            open={isModalOpen}
            onOk={handleOkButton}
            onCancel={() => setIsModalOpen(false)}
            maskClosable={false}
            okText={isAuthenticated ? "Đánh giá! " : "Đăng Nhập Nhanh"}
            confirmLoading={loading} // Hiển thị trạng thái loading trên nút OK
            cancelButtonProps={{ style: { display: "none" } }}
            destroyOnClose={true}
        >
            <Divider />
            {isAuthenticated ? (
                <div>
                    <ConfigProvider locale={enUS}>
                        <ProForm submitter={{ render: () => <></> }}>
                            <Row gutter={[10, 10]}>
                                <Col span={24}>
                                    <div>
                                        Kính chào quý khách, bạn đang đánh giá
                                        sản phẩm <b>{productDetail?.name}</b>
                                    </div>
                                </Col>
                                <Col span={24}>
                                    <div>
                                        Tên khách hàng: <b>{user?.name}</b>
                                        <br />
                                        Email: <b>{user?.email}</b>
                                    </div>
                                </Col>
                                <Col span={24}>
                                    <ProForm.Item
                                        label="Upload ảnh đánh giá sản phẩm"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Vui lòng upload ảnh!",
                                            },
                                        ]}
                                    >
                                        <Upload {...propsUpload}>
                                            <Button
                                                icon={<UploadOutlined />}
                                                disabled={loading}
                                            >
                                                Tải lên ảnh của bạn (Hỗ trợ
                                                *.jpeg, *.png, *.gif, *.bmp,
                                                *.webp, &lt; 5MB)
                                            </Button>
                                        </Upload>
                                    </ProForm.Item>
                                </Col>
                                <ProCard
                                    title="Comment"
                                    subTitle="Đánh giá sản phẩm"
                                    headStyle={{ color: "#d81921" }}
                                    style={{ marginBottom: 20 }}
                                    headerBordered
                                    size="small"
                                    bordered
                                >
                                    <Col span={24}>
                                        <TextArea
                                            rows={4}
                                            value={comment}
                                            onChange={(e) =>
                                                setComment(e.target.value)
                                            }
                                            placeholder="Hãy nhập nhận xét của bạn về sản phẩm"
                                            disabled={loading}
                                        />
                                    </Col>
                                </ProCard>
                            </Row>
                        </ProForm>
                    </ConfigProvider>
                </div>
            ) : (
                <div>
                    Bạn chưa đăng nhập hệ thống. Vui lòng đăng nhập để có thể
                    "Đánh giá" bạn nhé -.-{" "}
                </div>
            )}
            <Divider />
        </Modal>
    );
};

export default ApplyModal;
