/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import { Container } from "reactstrap";
// Import compact header styles
import "assets/css/compact-header.css";

const CompactHeader = ({ title, subtitle, icon, className = "" }) => {
  return (
    <>
      <div className={`header bg-gradient-info compact ${className}`} style={{ position: 'relative', zIndex: 1 }}>
        <Container fluid>
          <div className="header-body">
            {/* Empty header body for minimal spacing */}
          </div>
        </Container>
      </div>
    </>
  );
};

export default CompactHeader;
