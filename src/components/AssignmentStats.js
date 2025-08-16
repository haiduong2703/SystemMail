import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle, Row, Col, Badge } from "reactstrap";
import { API_BASE_URL } from "constants/api.js";

const AssignmentStats = () => {
  const [stats, setStats] = useState({
    totalAssigned: 0,
    assignedToGroups: 0,
    assignedToPics: 0,
    pendingReply: 0,
    groups: 0,
    pics: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);

      // Load assigned mails
      const assignedResponse = await fetch(
        `${API_BASE_URL}/api/assigned-mails?groupId=all`
      );
      const assignedMails = await assignedResponse.json();

      // Load groups
      const groupsResponse = await fetch(`${API_BASE_URL}/api/groups`);
      const groups = await groupsResponse.json();

      // Load PICs
      const picsResponse = await fetch(`${API_BASE_URL}/api/pics`);
      const pics = await picsResponse.json();

      setStats({
        totalAssigned: assignedMails.length,
        assignedToGroups: assignedMails.filter(
          (m) => m.assignedTo?.type === "group"
        ).length,
        assignedToPics: assignedMails.filter(
          (m) => m.assignedTo?.type === "pic"
        ).length,
        pendingReply: assignedMails.filter((m) => !m.isReplied).length,
        groups: groups.length,
        pics: pics.length,
      });
    } catch (err) {
      console.error("Failed to load assignment stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="card-stats mb-4 mb-xl-0">
        <CardBody>
          <div className="text-center">
            <i className="fas fa-spinner fa-spin"></i>
            <p className="mt-2 mb-0">Loading...</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="card-stats mb-4 mb-xl-0">
      <CardBody>
        <Row>
          <div className="col">
            <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
              Assignment Overview
            </CardTitle>
            <span className="h2 font-weight-bold mb-0">
              {stats.totalAssigned}
            </span>
            <p className="mt-1 mb-0 text-muted text-sm">
              <span className="text-success mr-2">
                <i className="fa fa-arrow-up" />
              </span>
              Total Assigned Mails
            </p>
          </div>
          <Col className="col-auto">
            <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
              <i className="fas fa-tasks" />
            </div>
          </Col>
        </Row>

        {/* <div className="mt-3">
          <Row>
            <Col xs="6">
              <div className="text-center">
                <Badge color="info" pill className="mb-1">
                  {stats.assignedToGroups}
                </Badge>
                <p className="text-xs text-muted mb-0">To Groups</p>
              </div>
            </Col>
            <Col xs="6">
              <div className="text-center">
                <Badge color="success" pill className="mb-1">
                  {stats.assignedToPics}
                </Badge>
                <p className="text-xs text-muted mb-0">To PICs</p>
              </div>
            </Col>
          </Row>
          
          <Row className="mt-2">
            <Col xs="6">
              <div className="text-center">
                <Badge color="primary" pill className="mb-1">
                  {stats.groups}
                </Badge>
                <p className="text-xs text-muted mb-0">Active Groups</p>
              </div>
            </Col>
            <Col xs="6">
              <div className="text-center">
                <Badge color="warning" pill className="mb-1">
                  {stats.pendingReply}
                </Badge>
                <p className="text-xs text-muted mb-0">Pending Reply</p>
              </div>
            </Col>
          </Row>
        </div> */}
      </CardBody>
    </Card>
  );
};

export default AssignmentStats;
