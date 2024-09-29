import React from 'react'
import { Button, Form, Input, Modal, Select, DatePicker } from 'antd';

function AddIncomeModal({ isIncomeModalVisible, handleIncomeCancel, onFinish}) {
  const [form] = Form.useForm();
  return (
    <Modal
        style= {{fontWeight:600 }}
        title= "Add Expense"
        visible= {isIncomeModalVisible}
        onCancel={handleIncomeCancel}
        footer={null}
    >
        <Form
            form = {form}
            layout ="vertical"
            onFinish={(values) => {
                onFinish(values, "income");
                form.resetFields();
            }}
        >
            <Form.Item
                style={{ fontWeight : 600}}
                label =" Name"
                name = "name"
                rules={[
                    {
                        required: true,
                        message: "Please input the name of the Transaction",
                    },
                ]}
            >
                <Input type='text' className='custom-input' />
            </Form.Item>
            <Form.Item
                style={{ fontWeight : 600}}
                label =" Amount"
                name = "amount"
                rules={[
                    {
                        required: true,
                        message: "Please input the expense amount!",
                    },
                ]}
            >
                <Input type='number' className='custom-input' />
            </Form.Item>
            <Form.Item
                style={{ fontWeight : 600}}
                label =" Date"
                name = "date"
                rules={[
                    {
                        required: true,
                        message: "Please select a income Date!",
                    },
                ]}
            >
                <DatePicker className='custom-input' format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
                style={{ fontWeight : 600}}
                label =" Tag"
                name = "tag"
                rules={[
                    {
                        required: true,
                        message: "Please select a tag!",
                    },
                ]}
            >
                <Select className='select-input-2'>
                    <Select.Option value ="sallary">Sallary</Select.Option>
                    <Select.Option value ="invenstment">Invenstment</Select.Option>
                    <Select.Option value ="freelance">Freelance</Select.Option>
                    <Select.Option value ="sip">SIP</Select.Option>
                    {/* add more */}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button className='btn btn-blue' type='primary' htmlType='submit'>
                    Add Income
                </Button>
            </Form.Item>
        </Form>
    </Modal>
  )
}

export default AddIncomeModal