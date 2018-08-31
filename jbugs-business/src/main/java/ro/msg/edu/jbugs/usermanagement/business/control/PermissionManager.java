package ro.msg.edu.jbugs.usermanagement.business.control;


import com.auth0.jwt.JWT;
import com.google.gson.Gson;
import ro.msg.edu.jbugs.usermanagement.business.exceptions.BusinessException;
import ro.msg.edu.jbugs.usermanagement.business.service.PermissionManagementService;
import ro.msg.edu.jbugs.usermanagement.business.service.UserManagementService;
import ro.msg.edu.jbugs.usermanagement.business.utils.Secured;

import javax.ejb.EJB;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;

@Path("/manage-permissions")
public class PermissionManager {
	@EJB
	private UserManagementService userManagementController;

	@EJB
	private PermissionManagementService permissionManagementController;

	//TODO : fix request types.

	@GET
	@Secured("USER_MANAGEMENT")
	@Produces("application/json")
	@Path("/add-permission-to-role")
	public Response addPermissionToRole(@QueryParam("permissionType") String permissionType,
										@QueryParam("roleType") String roleType) {

		permissionManagementController.addPermissionToRole(permissionType, roleType);
		return Response.ok().build();


	}

	@GET
	@Secured("USER_MANAGEMENT")
	@Produces("application/json")
	@Path("/revoke-permission-from-role")
	public Response revokePermissionFromRole(@QueryParam("permissionType") String permissionType,
											 @QueryParam("roleType") String roleType) {

		permissionManagementController.revokePermissionFromRole(roleType, permissionType);
		return Response.ok().build();


	}

	private String getRequester(@Context HttpHeaders headers) {
		String authorizationHeader = headers.getRequestHeader("authorization").get(0);
		String token = authorizationHeader.substring("Bearer".length()).trim();
		String requesterUsername = JWT.decode(token).getClaim("username").asString();
		return requesterUsername;
	}

	@GET
	@Secured("USER_MANAGEMENT")
	@Produces("application/json")
	@Path("/add-role-to-user")
	public Response addRoleToUser(@QueryParam("username") String username,
								  @QueryParam("roleType") String roleType,
								  @Context HttpHeaders headers) {
		try {
			permissionManagementController.addRoleToUser(roleType, username, getRequester(headers));
			return Response.ok().build();
		} catch (BusinessException e) {
			return Response.status(Response.Status.BAD_REQUEST).entity(e.getExceptionCode()).build();
		}
	}

	@GET
	@Secured("USER_MANAGEMENT")
	@Produces("application/json")
	@Path("/revoke-role-from-user")
	public Response revokeRoleFromUser(@QueryParam("username") String username,
									   @QueryParam("roleType") String roleType,
									   @Context HttpHeaders headers) {
		try {
			permissionManagementController.revokeRoleFromUser(roleType, username, getRequester(headers));
			return Response.ok().build();
		} catch (BusinessException e) {
			return Response.status(Response.Status.BAD_REQUEST).entity(e.getExceptionCode()).build();
		}
	}


	@GET
	@Secured("USER_MANAGEMENT")
	@Path("/get-all-permissions")
	@Produces("application/json")
	public Response getAllPermissions() {
		return Response
				.ok(new Gson().toJson(permissionManagementController.getAllPermissions()))
				.build();
	}


	@GET
	@Secured("USER_MANAGEMENT")
	@Path("/get-all-roles")
	@Produces("application/json")
	public Response getAllRoles() {
		return Response
				.ok(new Gson().toJson(permissionManagementController.getAllRoles()))
				.build();
	}

	@GET
	@Secured("USER_MANAGEMENT")
	@Path("/get-permissions-for-role")
	@Produces("application/json")
	@Consumes("application/json")
	public Response getPermissionsForRole(@QueryParam("roleType") String roleType) {
		try {
			return Response
					.ok(new Gson().toJson(
							permissionManagementController.getPermissionsByRole(roleType)))
					.build();
		} catch (BusinessException e) {
			return Response.status(Response.Status.BAD_REQUEST).entity(e.getExceptionCode()).build();
		}
	}


}
