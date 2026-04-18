import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import "./PermissionMatrixLayout.css";

export interface PermissionRole {
  id: string;
  label: string;
}

export interface PermissionResource {
  id: string;
  label: string;
  actions?: string[];
}

export interface PermissionMatrixLayoutProps extends HTMLAttributes<HTMLDivElement> {
  roles: PermissionRole[];
  resources: PermissionResource[];
  renderCell: (
    role: PermissionRole,
    resource: PermissionResource,
    action?: string,
  ) => ReactNode;
  toolbar?: ReactNode;
  label?: string;
}

export const PermissionMatrixLayout = forwardRef<
  HTMLDivElement,
  PermissionMatrixLayoutProps
>(function PermissionMatrixLayout(
  {
    roles,
    resources,
    renderCell,
    toolbar,
    label = "Permission matrix",
    className,
    ...rest
  },
  ref,
) {
  const classes = ["ui-permission-matrix", className].filter(Boolean).join(" ");

  return (
    <Box
      ref={ref as Ref<HTMLElement>}
      direction="column"
      gap="content"
      className={classes}
      role="region"
      aria-label={label}
      {...rest}
    >
      {toolbar && (
        <Box
          align="center"
          gap="inline"
          className="ui-permission-matrix__toolbar"
        >
          {toolbar}
        </Box>
      )}
      <div className="ui-permission-matrix__scroll">
        <table className="ui-permission-matrix__table">
          <thead>
            <tr>
              <th
                scope="col"
                className="ui-permission-matrix__corner"
              >
                <span className="ui-permission-matrix__sr">Resource</span>
              </th>
              {roles.map((role) => (
                <th
                  key={role.id}
                  scope="col"
                  className="ui-permission-matrix__role-header"
                >
                  {role.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => {
              const actions = resource.actions;
              if (actions && actions.length > 0) {
                return actions.map((action, idx) => (
                  <tr key={`${resource.id}:${action}`}>
                    <th
                      scope="row"
                      className="ui-permission-matrix__resource-header"
                    >
                      {idx === 0 && (
                        <Text
                          as="span"
                          weight="semibold"
                          color="primary"
                          className="ui-permission-matrix__resource-label"
                        >
                          {resource.label}
                        </Text>
                      )}
                      <Text
                        as="span"
                        size="caption"
                        color="secondary"
                        className="ui-permission-matrix__action-label"
                      >
                        {action}
                      </Text>
                    </th>
                    {roles.map((role) => (
                      <td
                        key={role.id}
                        className="ui-permission-matrix__cell"
                      >
                        {renderCell(role, resource, action)}
                      </td>
                    ))}
                  </tr>
                ));
              }
              return (
                <tr key={resource.id}>
                  <th
                    scope="row"
                    className="ui-permission-matrix__resource-header"
                  >
                    <Text
                      as="span"
                      weight="semibold"
                      color="primary"
                      className="ui-permission-matrix__resource-label"
                    >
                      {resource.label}
                    </Text>
                  </th>
                  {roles.map((role) => (
                    <td
                      key={role.id}
                      className="ui-permission-matrix__cell"
                    >
                      {renderCell(role, resource)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Box>
  );
});
