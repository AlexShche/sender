import React, {useState} from 'react'
import {Button, Checkbox, DatePicker, Form, Input, message} from "antd";
import moment from "moment";
import axios from 'axios'
import './App.css';

const {TextArea} = Input;

const App = () => {

    const [agreement, setAgreement] = useState(true)
    const [form] = Form.useForm()
    const requiredMessage = 'Обязательное поле'

    const range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    const disabledDate = (current) => {
        return current && current < moment().endOf('day');
    }

    const handleSubmit = async () => {
        const values = await form.validateFields()
        const body = {
            id: Date.now(),
            data: {
                phone: '+' + values.phone.replace(/[^\d]/g, ''),
                date: Date.parse(values.date),
                comment: values.comment
            }
        }
        await axios.post(
            'https://interview.gazilla-lounge.ru/api/submit',
            JSON.stringify(body)
        )
            .then((response) => {
                if (response.data.error){
                    message.error('Сбой при отправке, попробуйте еще раз')
                }
                else{
                    message.success('Спасибо, наш оператор перезвонит вам в указанное время')
                }
            })
            .catch(e => {
                message.config(e)
            })
    }

    return (
        <div className="App">
            <Form form={form} onSubmit={e => console.log(e)}>
                <Form.Item
                    label="Номер телефона (можно без +)"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: 'Обязательное поле, минимальное количество символов 11',
                            min: 11
                        }
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Выберите дату и время (МСК)"
                    name="date"
                    rules={[
                        {
                            required: true,
                            message: requiredMessage
                        }
                    ]}
                >
                    <DatePicker
                        placeholder=''
                        format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={disabledDate}
                        showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}
                    />
                </Form.Item>

                <Form.Item
                    label="Комментарий"
                    name="comment"
                >
                    <TextArea/>
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked">
                    <Checkbox onChange={e => setAgreement(!e.target.checked)}>Согласен с предоставлением
                        услуги</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button disabled={agreement} type="primary" htmlType="submit" onClick={handleSubmit}>
                        Отправить
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default App;
