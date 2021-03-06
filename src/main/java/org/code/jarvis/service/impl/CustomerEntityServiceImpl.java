package org.code.jarvis.service.impl;

import org.code.jarvis.model.core.ICustomer;
import org.code.jarvis.repository.CustomerEntityDao;
import org.code.jarvis.repository.EntityDao;
import org.code.jarvis.service.CustomerEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Created by KimChheng on 5/19/2017.
 */
@Service
public class CustomerEntityServiceImpl extends AbstractEntityService implements CustomerEntityService {

    @Autowired
    private CustomerEntityDao applicantDao;

    @Override
    public ICustomer saveOrUpdateCustomer(MultipartFile[] files, ICustomer customer) throws Exception {
        return applicantDao.saveOrUpdateCustomer(files, customer);
    }

    @Override
    public EntityDao getDao() {
        return applicantDao;
    }
}
