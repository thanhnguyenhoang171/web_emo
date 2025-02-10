import { callUpdateRatingStatus } from "@/config/api";
import { IRating } from "@/types/backend";
import { Badge, Button, Descriptions, Drawer, Form, Select, message, notification } from "antd";
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
const { Option } = Select;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IRating | null | any;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}
const ViewDetailRating = (props: IProps) => {
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { onClose, open, dataInit, setDataInit, reloadTable } = props;
    const [form] = Form.useForm();

    const handleChangeStatus = async () => {
        setIsSubmit(true);

        const status = form.getFieldValue('status');
        const res = await callUpdateRatingStatus(dataInit?._id, status)
        if (res.data) {
            message.success("Update Rating status thành công!");
            setDataInit(null);
            onClose(false);
            reloadTable();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }

        setIsSubmit(false);
    }

    useEffect(() => {
        if (dataInit) {
            form.setFieldValue("status", dataInit.status)
        }
        return () => form.resetFields();
    }, [dataInit])

    return (
        <>
            <Drawer
                title="Thông Tin Đánh giá của Người dùng"
                placement="right"
                onClose={() => {
                    onClose(false);
                    setDataInit(null);
                }}
                open={open}
                width={"40vw"}
                maskClosable={false}
                destroyOnClose
                extra={
                    <Button
                        loading={isSubmit}
                        type="primary"
                        onClick={handleChangeStatus}
                    >
                        Change Status
                    </Button>
                }
            >
                <Descriptions title="" bordered column={2} layout="vertical">
                    <Descriptions.Item label="Tên Loại sản phẩm">
                        {dataInit?.typeId?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên Sản phẩm">
                        {dataInit?.productId?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Form form={form}>
                            <Form.Item name={"status"}>
                                <Select
                                    // placeholder="Select a option and change input text above"
                                    // onChange={onGenderChange}
                                    // allowClear
                                    style={{ width: "100%" }}
                                    defaultValue={dataInit?.status}
                                >
                                    <Option value="PENDING">PENDING</Option>
                                    <Option value="REVIEWING">REVIEWING</Option>
                                    <Option value="APPROVED">APPROVED</Option>
                                    <Option value="REJECTED">REJECTED</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Descriptions.Item>

                    <Descriptions.Item label="Comment">
                        {dataInit?.comment}
                    </Descriptions.Item>

                    <Descriptions.Item label="Được đánh giá tốt?">
                        {dataInit?.isPositive}
                    </Descriptions.Item>

                    <Descriptions.Item label="Ngày tạo">
                        {dataInit && dataInit.createdAt
                            ? dayjs(dataInit.createdAt).format(
                                  "DD-MM-YYYY HH:mm:ss"
                              )
                            : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày sửa">
                        {dataInit && dataInit.updatedAt
                            ? dayjs(dataInit.updatedAt).format(
                                  "DD-MM-YYYY HH:mm:ss"
                              )
                            : ""}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    );
}

export default ViewDetailRating;