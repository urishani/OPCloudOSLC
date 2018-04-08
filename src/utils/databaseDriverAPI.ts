export interface DatabaseDriver {
    /**
     * Modelnames is an object of properties which are the model names, and whose value is either 'true' 
     * or a object with more version information.
     * Legal entries should have an object as a value, with an 'id' property of the form Mnnnn where
     * nnnn is a number with leading zeroes.
     * The method is asynchronous with a callback providing the modelNames object as the second parameter, with 
     * err to define an error string in case of failure to get the result.
     */
    getModelNames (callback:(err:string, modelNames:{}));
    /**
     * Setter of the model names when it is changed due to adding or removing a model entry.
     * Counter to the getModelNames.
     * Parameters:
     *    modelNames - the new object with model names to replace the existing one.
     *    ifMatch - a string which should match a stamp stored in the model to verify that indeed
     *       the replacing object is an update of the current one stored in the database.
     *       If the parameter is null, than the check is ignored. Yet, the driver may decide that
     *       the operation fails due to mismatch.
     */
    setModelNames (modelNames:{}, ifMatch:string, callback:function(err:string));
    /**
     * Get a model by its name.
     * Params:
     * name - the string name of the model, it is also the 'name' property of the 
     * model object.
     * callback - a function taking two parameters: 
     *  err - a string indicating failure, 
     *  model - the model object, having a 'name' property same as the value in the name parameter.
     * 
     * Legal models should have an 'id' property which is the same as that property
     * for the model entrance in the modelNames object.
     */
    getModelByName (name:string, callback:function(err:string, model:{}));
    /**
     * getModelById is the preferred access method to get a model using is unique id.
     * Parameters:
     *  id - string of the id in the form Mnnnn with nnnn is a zeroes-leading number.
     *  callback - function with two parameters:
     *     err - string which is defined in case of failure
     *     model - the model object, having a property 'id' which equals the id parameter.
     */
    getModelById(id:string, callback:function(err:string, model:{}));
    /**
     * setMode - setter counter to the getters above.
     * Parameters:
     *    model - the model object to replace an existing one, or to be created. 
     *    ifMatch - string to be matched against a value stored in the database to
     *       verify that indeed this model is an update of the latest model instance
     *       in the database. If this parameter is null, it is ignored.
     *       YET: the driver implementation may choose to mark such cases as failure.
     *    callBack - function with one parameter: err to indicate failures with a defined
     *       string value describing the failure reason.
     */
    setModel (model:{}, ifMatch:string, callback(err:string));
    /**
     * getDatabaseMeta returns the metadata of the database per OPCloud. That is not
     * the database metadata specific to the database service being used.
     * Parameters:
     *    callBack with two parameters:
     *       err: string that is undefined in case of success, or the error text.
     *       metaData object, which has at least the counter property whose value is
     *       the property counter which is numeric. The other expected property is optional
     *       and is a key string to be used as the ifMatch parameter in the setter method.
     */
    getDatabaseMeta(callback(err:string, meta:{counter:{counter:number}, key?:string}));
    /**
     * Setter of the database meta data for OPCloud. Not the database specific implementation meta data.
     * Parameters:
     *    callback - takes 3 parameters:
     *      meta: object having the counter property.
     *      ifMatch: string to be matched against a value in the database to ensure proper
     *         update of the latest meta data. If null, it is ignored. But specitif implementation fo the 
     *         driver may choose to report error in such cases.
     *      callback - callback taking the err string parameter to indicate success (if undefined) or
     *         failure with the string explanation fot that.
     */
    setDatabaseMeta(meta:{counter:{counter:number}}, ifMatch:string, callback(err:string));
    )