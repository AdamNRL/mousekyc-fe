import React, { PureComponent } from 'react'; 
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Icon, Row, Col, Button, Input, Layout } from 'antd';
import { connectAuth, authActionCreators } from 'core';
import { promisify } from '../../utilities';
import logo from 'assets/img/logo.png';

const { Content, Header } = Layout;

class SignInContainer extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        token: PropTypes.string,
      }),
    }).isRequired,
    login: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isFocus: false,
      user: ''
    }
  }

  componentWillMount() {
    let token = this.props.match.params.token;
    promisify(this.props.login, { token: token})
      .then((user) => {
        this.setState(...this.state, {user: user});
      })
      .catch(e => console.log(e));
  }

  handleEmail = () => {
    this.setState(...this.state, {isFocus: true});
  }

  showValidationPage = () => {
    this.props.history.push('/validation');
  }

  render () {
    var continueButton, emailInput, msg = '';
    emailInput = <Input placeholder="Email Address" onClick={this.handleClick} />
    switch(this.state.user.approvalStatus) {
      case 'NO_SUBMISSION_YET':
        continueButton = <Button className="continue_btn" onClick={this.showValidationPage}>CONTINUE</Button>
      break;
      case 'PENDING':
        continueButton = <Button disabled="true" className="continue_btn">PENDING</Button>
      break;
      case 'APPROVED':
        continueButton = <Button className="continue_btn kyc_complete_btn">KYC COMPLETE</Button>
        emailInput = <Input className="kyc_complete_input" value={this.state.user.email ? this.state.user.email : '' } readOnly={this.state.user.email ? true: false} placeholder="Email Address" onClick={this.handleEmail} suffix={<Icon style={{ fontSize: 16, color: '#3cb878' }} type="check-circle" /> }/> 
        msg = <span className="kyc_complete_msg">User has had a succssful review</span>
      break;
      case 'ACTION_REQUESTED':
        continueButton = <Button className="continue_btn kyc_error" onClick={this.showValidationPage}>KYC ERROR</Button>
        emailInput = <Input className="kyc_error_input" value={this.state.user.email ? this.state.user.email : '' } readOnly={this.state.user.email ? true: false} placeholder="Email Address" onClick={this.handleClick} suffix={<Icon style={{ fontSize: 16, color: '#e34132' }} type="question-circle" /> }/>
        msg = <span className="kyc_error_msg">Insufficent information</span>
      break;
      case 'BLOCKED':
        continueButton = <Button disabled="true" className="continue_btn">BLOCKED</Button>
      break;
    }
    return (
      <div className="block">
        <Layout>
          <Header className="header"></Header>
          <Layout>
            <Content className="main">
              <Row className="sign_logo_area">
                <Col span={5} offset={5}>
                  <img alt="true" src={logo} className="logo"/>
                </Col>
                <Col span={12} className="title_area">
                  <Row className="authActionCreatorsrow_titlbindActionCreatorse"><Col><span  className="logo_title">NO REST</span></Col></Row>
                  <Row className="row_title"><Col><span className="logo_title">LABS</span></Col></Row>
                </Col>
              </Row>
              <Row className="email_area">
                <Col offset={4} span={16}>
                  { this.state.isFocus ?
                  <span className="label_name">Email Address</span>
                  : null
                  }
                  { emailInput }
                </Col>
              </Row>
              <Row className="msg_area">
                <Col offset={5} span={16}>
                  { msg }
                </Col>
              </Row>
              <Row>
                <Col offset={4} span={16}>
                  { continueButton }
                </Col>
              </Row>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }  
}
const mapDisptachToProps = (dispatch) => {
  const {
    login
  } = authActionCreators;

  return bindActionCreators({
    login
  }, dispatch);
}

export default connectAuth(undefined, mapDisptachToProps)(SignInContainer);