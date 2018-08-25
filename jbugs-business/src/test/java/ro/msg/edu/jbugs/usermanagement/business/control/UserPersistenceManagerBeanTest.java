package ro.msg.edu.jbugs.usermanagement.business.control;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import ro.msg.edu.jbugs.usermanagement.business.dto.UserDTO;
import ro.msg.edu.jbugs.usermanagement.business.exceptions.BusinessException;
import ro.msg.edu.jbugs.usermanagement.business.exceptions.ExceptionCode;
import ro.msg.edu.jbugs.usermanagement.business.utils.Encryptor;
import ro.msg.edu.jbugs.usermanagement.persistence.dao.UserPersistenceManager;
import ro.msg.edu.jbugs.usermanagement.persistence.entity.User;

import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class UserPersistenceManagerBeanTest {



    @InjectMocks
    private UserManagementController userManagementController;

    @Mock
    private UserPersistenceManager userPersistenceManager;

    @Test
    public void testGenerateUsername_ExpectedOK(){
        when(userPersistenceManager.getUserByUsername(any(String.class)))
                .thenReturn(Optional.empty());

        assertEquals("iftind",userManagementController.generateUsername("Dan","Iftinca"));
    }

    @Test
    public void testGenerateUsername_Expectedmarini(){
        when(userPersistenceManager.getUserByUsername(any(String.class)))
                .thenReturn(Optional.empty());

        assertEquals("marini",userManagementController.generateUsername("Ion","Marin"));
    }

    @Test
    public void testGenerateUsername_Expectedionion(){
        when(userPersistenceManager.getUserByUsername(any(String.class)))
                .thenReturn(Optional.empty());

        assertEquals("ionion",userManagementController.generateUsername("Ion","Ion"));
    }

    @Test
    public void testGenerateUsername_Expectedba0000(){
        when(userPersistenceManager.getUserByUsername(any(String.class)))
                .thenReturn(Optional.empty());

        assertEquals("ba0000",userManagementController.generateUsername("a","b"));
    }

    @Test
    public void testGenerateUsername_Expected(){
        User mockUser = new User();
        mockUser.setUsername("marini");
        when(userPersistenceManager.getUserByUsername(any(String.class)))
                .thenReturn(Optional.empty());
        when(userPersistenceManager.getUserByUsername("marini"))
                .thenReturn(Optional.of(mockUser));
        when(userPersistenceManager.getUserByUsername("mariio"))
                .thenReturn(Optional.empty());
        assertEquals("mariio",userManagementController.generateUsername("Ion","Marin"));
    }




    @Test
    public void testLogin_wrongUsername() {
        when(userPersistenceManager.getUserByUsername(any(String.class)))
                .thenReturn(Optional.empty());
        try {
            userManagementController.login("a", "s");
            fail("Shouldn't reach this point");
        } catch (BusinessException e){
            assertEquals(ExceptionCode.USERNAME_NOT_VALID,e.getExceptionCode());
        }
    }

    @Test
    public void testLogin_Success() {
        User user = mock(User.class);
        when(user.getUsername()).thenReturn("salut");
        when(user.getPassword()).thenReturn(Encryptor.encrypt("secret"));

        when(userPersistenceManager.getUserByUsername(any(String.class)))
                .thenReturn(Optional.of(user));

        when(user.getActive()).thenReturn(true);


        try{
            UserDTO userDTO = userManagementController.login("salut","secret");
            assertEquals(userDTO.getUsername(),user.getUsername());
        } catch(BusinessException e){
            fail("Shouldn't reach this point: "+ e.getExceptionCode().getMessage());
        }
    }

    @Test
    public void testCreateUser_Success(){
        when(userPersistenceManager.getUserByEmail(any(String.class)))
                .thenReturn(Optional.empty());

        when(userPersistenceManager.getUserByUsername(any(String.class)))
                .thenReturn(Optional.empty());

        UserDTO userDTO = new UserDTO();
        userDTO.setFirstName("Cristi");
        userDTO.setLastName("Borcea");
        userDTO.setEmail("dinamo@msggroup.com");
        userDTO.setPhoneNumber("0747046000");
        userDTO.setPassword("IloveSteaua");
        try{
        UserDTO createdUser = userManagementController.createUser(userDTO);
        assertEquals(userDTO.getFirstName(),createdUser.getFirstName());
        assertEquals(userDTO.getLastName(),createdUser.getLastName());
        assertEquals(userDTO.getEmail(),createdUser.getEmail());
        assertEquals("borcec",createdUser.getUsername());
        } catch (BusinessException e){
            fail("Should not reach this point");
        }
    }
}