import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  Badge,
} from "reactstrap";
import { useMailContext } from "contexts/MailContext.js";

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const { reloadStatus } = useMailContext();

  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin" && prop.name) {
        // Ensure it's an admin link with a name
        const isNewMailLink = prop.path === "/valid-mails";
        return (
          <NavItem key={key}>
            <NavLink
              to={prop.layout + prop.path}
              tag={NavLinkRRD}
              onClick={closeCollapse}
              activeClassName="active"
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <i className={prop.icon} />
                {prop.name}
              </div>
              {isNewMailLink && reloadStatus && (
                <Badge color="warning" pill>
                  New
                </Badge>
              )}
            </NavLink>
          </NavItem>
        );
      } else {
        return null;
      }
    });
  };

  const { bgColor, routes, logo } = props;
  let navbarBrandProps;

  return (
    <div>
      {/* Collapse header */}
      <div className="navbar-collapse-header d-md-none">
        {/* ... existing code ... */}
      </div>
      {/* Navigation */}
      <Nav navbar>{createLinks(routes)}</Nav>
      {/* Divider */}
      <hr className="my-3" />
      {/* Heading */}
      {/* ... existing code ... */}
    </div>
  );
};

export default Sidebar;
