import { createGlobalStyle } from "styled-components";
// import Baloo from "../static/Inter-roman.var.woff2";
const Gstyles = createGlobalStyle`

@font-face {
		@import url("https://fonts.googleapis.com/css?family=Nunito:300,400,600,700&display=swap");
		@import url("https://fonts.googleapis.com/css2?family=Livvic:wght@400;500;600;700&display=swap");
	}
iframe{
	display:none ;
}
	* {
		font-family: "Livvic", sans-serif;
    	font-weight: 500;
  }

	body {
		background: #161c2d;
		display: flex;
		justify-content: center;
		background-repeat: no-repeat;
    background-attachment: fixed;

	}
	form{
		color: #FFFFFF !important;
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	.ant-form-item-label > * {
		color: #FFFFFF !important;

	}
	h1 {
		color:  #FFFFFF !important;
		text-align: center;
	}

	h2 {
		color:  #FFFFFF !important;
		text-align: center;
	}

	img {
		width: 300px;
		transition: .3s;
		cursor: pointer;
		/* transform: rotate3d(0, 1, 0, 180deg) */
	}
	/* style={{ margin: "-60px 0 0 0", border: "none" }} */

	button {
		background: none !important;
		border-radius: 10px !important;
		/* padding: 16px 24px !important; */
		display: flex !important;
		justify-content: center !important;
		align-items: center !important;
		
		img {
			width: 24px;
			height: 24px;
			margin: 0 6px 0 0;
		}
	}

.ant-message {
	max-width: 20%;
	right: 0 !important;
	left: auto !important;
	@media (max-width: 767px) {
		max-width: 100% !important;
	}	
}

.ant-btn-primary {
    color: #212529;
    border-color: transparent;
    background: #1890ff;
    text-shadow: transparent;
    box-shadow: transparent;
}
.ant-dropdown-menu {
	background: #3c4858 !important;
		span {
			color: #d9d9d9 !important;
			:hover {
				color: #3c4858 !important;
			}
			:focus {
				color: #3c4858 !important;
			}
			:active {
				color: #3c4858 !important;
			}
	}
}
.ant-popover-buttons {
	display: flex;
	gap: 8px;
	flex-direction: row;
	justify-content: end;
}
	input {
		background: #161c2d !important;
		border-radius: 10px!important;
		border: none !important;
		width: 100% !important;
		color: white !important;
		padding: 30px 130px 30px 130px !important;
		/* font-size: 28px!important; */
		/* box-sizing: border-box!important; */
		padding: 8px 12px !important;
		@media (max-width: 520px) {
		padding: 8px 12px !important;

			
		}
	}
	  
	.Container {
		width:100vw;
		display:flex;
		flex-direction: row;
		align-items:center;
		justify-content: space-around;

	}
	iframe {
		display:none ;
	}

	@keyframes spin {
    from {
			transform:rotate(0deg);
    }
    to {
			transform:rotate(360deg);
    }
	}

.activeLinkBtn {
	background: rgba(22, 31, 56, 1) !important; 
}

.ant-switch-handle::before {
	background-color: rgb(255, 201, 22);
}


.ant-switch {
	box-shadow: 0px 4px 8px rgba(0,0,0,0.35)!important;
}

.ant-popover-arrow {
	display: none !important;
}

.ant-alert {
	position: fixed !important;
	margin-top: 16px;
    z-index: 1010;
	width: 480px;
	@media (max-width: 520px) {
	width: 320px; 
	}
}

.ant-alert-warning {
	border: none;
    background-color: rgb(22 31 56);
	box-shadow: 0px 4px 8px rgba(0,0,0,0.35)!important;
}

.ant-alert-message {
	color: #FFFFFF !important;
}

.ant-btn-ghost {
    color: rgb(255 255 255) !important;
}
.ant-btn-ghost:hover, .ant-btn-ghost:focus {
    color: rgb(255 255 255 / 40%) !important;
    border-color: rgb(255 255 255 / 40%); 
}

.ant-message-notice-content {
	background: rgb(22 31 56);
}

.ant-message {
    color: #fff !important; 
}

.ant-popover-message {
    color: rgb(255 255 255);
}

.ant-btn {
color: rgb(255 255 255);
}

.ant-popover-inner {
    background-color: rgb(22 31 56);
}

.ant-btn:hover, .ant-btn:focus, .ant-btn:active {
    color: rgb(255 255 255 / 40%);
}

.ant-btn:hover, .ant-btn:focus {
	border-color: rgb(255 255 255 / 40%);
}

.selectorsoon {
  cursor: not-allowed !important;
	color: gray !important;
}
  `;


export default Gstyles;